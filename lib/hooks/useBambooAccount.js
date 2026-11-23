import { useCallback, useEffect, useRef, useState } from "react";
import { bamboo, clearLegacyBambooSession, isCancelled } from "../bamboo";
const initial = () => ({
  account: null,
  portfolio: null,
  breakdown: null,
  stocks: [],
  pendingOrders: [],
  withdrawals: [],
  operations: [],
  withdrawalNext: null,
  operationNext: null,
});
export default function useBambooAccount(accountId) {
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const run = useRef(0);
  const controller = useRef(null);
  const paging = useRef(new Set());
  const refresh = useCallback(async () => {
    controller.current?.abort();
    const signalController = new AbortController();
    controller.current = signalController;
    const signal = signalController.signal;
    const sequence = ++run.current;
    setLoading(true);
    setErrors({});
    try {
      const account = await bamboo(`/accounts/${accountId}`, { signal });
      if (signal.aborted || sequence !== run.current) return;
      setState((current) => ({ ...current, account }));
      if (!account.bamboo_user_id) return;
      const requests = {
        portfolio: "/portfolio",
        breakdown: "/portfolio/breakdown",
        stocks: "/holdings",
        pendingOrders: "/pending-orders",
        withdrawals: "/withdrawals",
        operations: "/operations",
      };
      const responses = await Promise.allSettled(
        Object.values(requests).map((path) =>
          bamboo(path, { accountId, signal })
        )
      );
      if (signal.aborted || sequence !== run.current) return;
      const next = {};
      const failures = {};
      Object.keys(requests).forEach((key, index) => {
        const result = responses[index];
        if (result.status === "rejected") {
          failures[key] = result.reason.message;
          return;
        }
        const value = result.value;
        if (key === "stocks") next.stocks = value.stocks || [];
        else if (key === "pendingOrders")
          next.pendingOrders = value.pending_orders || [];
        else if (key === "withdrawals") {
          next.withdrawals = value.withdrawals || [];
          next.withdrawalNext = value.next_token ?? null;
        } else if (key === "operations") {
          next.operations = value.data || [];
          next.operationNext = value.next_page_url
            ? value.current_page + 1
            : null;
        } else next[key] = value;
      });
      setState((current) => ({ ...current, ...next }));
      setErrors(failures);
    } catch (error) {
      if (!isCancelled(error) && sequence === run.current)
        setErrors({ account: error.message });
    } finally {
      if (sequence === run.current && !signal.aborted) setLoading(false);
    }
  }, [accountId]);
  const cancelRequests = useCallback(() => {
    ++run.current;
    controller.current?.abort();
  }, []);
  useEffect(() => {
    clearLegacyBambooSession();
    setState(initial());
    setErrors({});
    if (accountId) refresh();
    return cancelRequests;
  }, [accountId, refresh, cancelRequests]);
  const loadMore = useCallback(
    async (kind) => {
      const seq = run.current;
      const cursor =
        kind === "withdrawals" ? state.withdrawalNext : state.operationNext;
      const pageKey = `${seq}:${kind}:${cursor}`;
      if (cursor === null || paging.current.has(pageKey)) return;
      paging.current.add(pageKey);
      try {
        const value = await bamboo(
          kind === "withdrawals" ? "/withdrawals" : "/operations",
          {
            accountId,
            signal: controller.current?.signal,
            data:
              kind === "withdrawals"
                ? { next_token: cursor }
                : { page: cursor },
          }
        );
        if (seq !== run.current) return;
        setState((current) =>
          kind === "withdrawals"
            ? {
                ...current,
                withdrawals: [
                  ...current.withdrawals,
                  ...(value.withdrawals || []),
                ],
                withdrawalNext: value.next_token ?? null,
              }
            : {
                ...current,
                operations: [...current.operations, ...(value.data || [])],
                operationNext: value.next_page_url
                  ? value.current_page + 1
                  : null,
              }
        );
      } catch (e) {
        if (!isCancelled(e) && seq === run.current)
          setErrors((current) => ({ ...current, [kind]: e.message }));
      } finally {
        paging.current.delete(pageKey);
      }
    },
    [accountId, state.withdrawalNext, state.operationNext]
  );
  return { ...state, loading, errors, refresh, loadMore };
}

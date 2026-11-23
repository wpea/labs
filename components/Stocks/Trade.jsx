import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { apiAddress } from "../../lib/api";
import { bamboo, isCancelled, readJson } from "../../lib/bamboo";
import ActionDialog from "./ActionDialog";

export default function Trade({
  accountId,
  account,
  showDep,
  toggleAdd,
  onSuccess,
}) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [side, setSide] = useState("BUY");
  const [type, setType] = useState("MARKET");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiration, setExpiration] = useState("");
  const [extended, setExtended] = useState(false);
  const [enabled, setEnabled] = useState(account?.extended_hours_enabled);
  const [sellAll, setSellAll] = useState(false);
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [subAccounts, setSubAccounts] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [now, setNow] = useState(Date.now());
  const submission = useRef(false);
  const version = useRef(0);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive.current = false;
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${apiAddress}/stock/get/subs`, {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${readJson("token")}` },
      })
      .then((r) => setSubAccounts(r.data.data || []))
      .catch((e) => {
        if (!isCancelled(e))
          setError("Allocation accounts could not be loaded.");
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    ++version.current;
    setQuote(null);
    setError("");
  }, [
    selected,
    side,
    type,
    amount,
    quantity,
    price,
    expiration,
    extended,
    sellAll,
    accountId,
  ]);
  useEffect(() => {
    setMatches([]);
    if (query.trim().length < 2 || selected) {
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const result = await bamboo("/stocks/search", {
          accountId,
          signal: controller.signal,
          data: { query: query.trim() },
        });
        if (!controller.signal.aborted) setMatches(result.result || []);
      } catch (e) {
        if (!isCancelled(e)) setError(e.message);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selected, accountId]);
  useEffect(() => {
    setDetails(null);
    if (!selected) return;
    const controller = new AbortController();
    bamboo("/stocks/details", {
      accountId,
      signal: controller.signal,
      data: { symbol: selected.symbol },
    })
      .then((value) => {
        if (!controller.signal.aborted) setDetails(value);
      })
      .catch((e) => {
        if (!isCancelled(e)) setError(e.message);
      });
    return () => controller.abort();
  }, [selected, accountId]);
  async function calculate(e) {
    e.preventDefault();
    if (submission.current || !details) return;
    submission.current = true;
    setBusy(true);
    setError("");
    const current = version.current;
    try {
      const input = {
        symbol: selected.symbol,
        side,
        order_type: type,
        extended_hours_order: extended,
        sell_all: sellAll,
        ...(type === "MARKET"
          ? { amount: Number(amount) }
          : {
              price_per_share: Number(details.price),
              price: Number(price),
              quantity: Number(quantity),
              ...(expiration ? { expiration } : {}),
            }),
      };
      const result = await bamboo("/orders/calculate", {
        method: "POST",
        accountId,
        data: input,
      });
      if (alive.current && current === version.current) setQuote(result);
    } catch (e) {
      if (alive.current) setError(e.message);
    } finally {
      submission.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function place() {
    if (submission.current || !quote || quote.expires_at * 1000 <= Date.now())
      return;
    const values = Object.fromEntries(
      Object.entries(allocations)
        .filter(([, value]) => Number(value) > 0)
        .map(([key, value]) => [key, Number(value)])
    );
    if (
      Object.keys(values).length &&
      Math.abs(Object.values(values).reduce((a, b) => a + b, 0) - 100) > 0.001
    ) {
      setError("Allocations must total 100%.");
      return;
    }
    submission.current = true;
    setBusy(true);
    setError("");
    try {
      const operation = await bamboo("/orders", {
        method: "POST",
        accountId,
        data: {
          quote_id: quote.quote_id,
          allocations: side === "BUY" ? values : {},
        },
      });
      toast.success(`Order accepted. Status: ${operation.status}.`);
      onSuccess();
      toggleAdd();
    } catch (e) {
      setError(e.message);
      if (e.code === "quote_expired") setQuote(null);
    } finally {
      submission.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function optIn() {
    setBusy(true);
    setError("");
    try {
      await bamboo("/extended-hours", {
        method: "POST",
        accountId,
        data: { enabled: true },
      });
      setEnabled(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const expired = quote && quote.expires_at * 1000 <= now;
  const field = "block w-full rounded border-gray-300 mt-1 p-2";
  return (
    <ActionDialog
      title="Trade stocks"
      open={showDep}
      onClose={toggleAdd}
      busy={busy}
    >
      <form onSubmit={calculate} className="space-y-5">
        <fieldset disabled={busy} className="space-y-5">
          <div className="flex gap-2">
            {["BUY", "SELL"].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setSide(value)}
                aria-pressed={side === value}
                className={`btn flex-1 ${
                  side === value ? "bg-wp-blue border-none" : "btn-outline"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          {selected ? (
            <div className="flex justify-between p-4 bg-gray-50 rounded">
              <span>
                {selected.name} · {selected.symbol}
                <span className="block text-sm">
                  {details
                    ? `Market price: $${details.price}`
                    : "Loading price…"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setQuery("");
                }}
              >
                Change
              </button>
            </div>
          ) : (
            <label className="block text-sm">
              Find a stock
              <input
                className={field}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Company name or symbol"
              />
              {searching && <span>Searching…</span>}
              <div className="max-h-48 overflow-auto">
                {matches.map((stock) => (
                  <button
                    type="button"
                    key={stock.symbol}
                    className="block text-left w-full p-3 border-b"
                    onClick={() => setSelected(stock)}
                  >
                    {stock.name} · {stock.symbol}
                  </button>
                ))}
              </div>
            </label>
          )}
          <label className="block text-sm">
            Order type
            <select
              className={field}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === "STOP") setExtended(false);
              }}
            >
              {["MARKET", "LIMIT", "STOP"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          {type === "MARKET" ? (
            <label className="block text-sm">
              Amount (USD)
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                className={field}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">
                Quantity
                <input
                  required
                  type="number"
                  min="0.000001"
                  step="any"
                  className={field}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </label>
              <label className="text-sm">
                {type === "STOP" ? "Stop" : "Limit"} price (USD)
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={field}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
              <label className="text-sm col-span-2">
                Expiry (optional)
                <input
                  type="date"
                  className={field}
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                />
              </label>
            </div>
          )}
          {side === "SELL" && (
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={sellAll}
                onChange={(e) => setSellAll(e.target.checked)}
              />
              Sell all holdings of this stock
            </label>
          )}
          {type !== "STOP" && (
            <div className="text-sm">
              {enabled ? (
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={extended}
                    onChange={(e) => setExtended(e.target.checked)}
                  />
                  Allow extended-hours execution
                </label>
              ) : (
                <button type="button" className="underline" onClick={optIn}>
                  Enable extended-hours trading for this account
                </button>
              )}
              {extended && (
                <p className="mt-2 text-gray-600">
                  Eligibility is checked against the stock’s current status
                  before submission.
                </p>
              )}
            </div>
          )}
          {side === "BUY" && subAccounts.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm">
                Allocate this purchase (optional)
              </summary>
              <div className="space-y-2 mt-3">
                {subAccounts.map((a) => (
                  <label
                    key={a.slug}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="flex-1">{a.name}</span>
                    <input
                      aria-label={`${a.name} percentage`}
                      className="w-24 rounded border-gray-300"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={allocations[a.slug] || ""}
                      onChange={(e) =>
                        setAllocations({
                          ...allocations,
                          [a.slug]: e.target.value,
                        })
                      }
                    />
                    %
                  </label>
                ))}
              </div>
            </details>
          )}
        </fieldset>
        {error && (
          <p role="alert" className="p-3 bg-red-50 text-red-800 rounded">
            {error}
          </p>
        )}
        {quote && (
          <div className="p-4 bg-blue-50 rounded text-sm space-y-1">
            <p>Shares: {quote.quantity}</p>
            <p>Order value: ${quote.order_price}</p>
            <p>Fee: ${quote.fee}</p>
            <p>Total: ${quote.total_price}</p>
            <p>
              {expired
                ? "Calculation expired. Calculate again."
                : `Valid for ${Math.max(
                    0,
                    Math.ceil((quote.expires_at * 1000 - now) / 1000)
                  )} seconds`}
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            className="btn btn-outline flex-1"
            disabled={busy || !selected || !details}
            type="submit"
          >
            {busy ? "Working…" : "Calculate"}
          </button>
          <button
            className="btn bg-wp-blue border-none flex-1"
            type="button"
            onClick={place}
            disabled={busy || !quote || expired}
          >
            Place order
          </button>
        </div>
      </form>
    </ActionDialog>
  );
}

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
  const field =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-100";
  return (
    <ActionDialog
      title="Search for a stock"
      open={showDep}
      onClose={toggleAdd}
      busy={busy}
      tabs={
        <div className="grid grid-cols-2">
          {["BUY", "SELL"].map((value) => (
            <button
              type="button"
              key={value}
              disabled={busy}
              onClick={() => setSide(value)}
              aria-pressed={side === value}
              className={`${side !== value ? "opacity-20" : ""} ${
                value === "BUY"
                  ? "bg-blue-50 border-[#2D7EC2] text-[#2D7EC2]"
                  : "bg-red-50 border-red-600 text-red-600"
              } border-b-2 py-6 text-xl font-semibold`}
            >
              {value === "BUY" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>
      }
    >
      <form onSubmit={calculate} className="space-y-6">
        <fieldset disabled={busy} className="space-y-6">
          <div>
            <div
              className={`${
                !selected && query ? "rounded-t-lg" : "rounded-lg"
              } border border-gray-300 px-3`}
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 flex-shrink-0 text-wp-blue"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M17 17L22 22M19.5 10.75C19.5 15.5825 15.5825 19.5 10.75 19.5C5.91751 19.5 2 15.5825 2 10.75C2 5.91751 5.91751 2 10.75 2C15.5825 2 19.5 5.91751 19.5 10.75Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {selected ? (
                  <div className="flex w-full items-center justify-between space-x-3 py-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="bg-contain bg-center bg-no-repeat bg-gray-200 rounded p-4"
                        style={{ backgroundImage: `url(${selected.logo})` }}
                      />
                      <span className="text-xs">
                        {selected.name} ({selected.symbol})
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Change stock"
                      className="text-red-400"
                      onClick={() => {
                        setSelected(null);
                        setQuery("");
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M16 8L8 16M8 8L16 16" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <input
                    aria-label="Search for a stock"
                    className="text-md w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SYMBOL (ex. TSLA)"
                  />
                )}
              </div>
            </div>
            {!selected && query && (
              <div className="border-gray-300 max-h-48 overflow-auto rounded-b-xl border-b border-r border-l">
                {searching && (
                  <p role="status" className="p-4 text-xs text-gray-500">
                    Searching…
                  </p>
                )}
                {!searching && query.trim().length >= 2 && !matches.length && (
                  <p className="p-4 text-xs text-gray-500">No stocks found.</p>
                )}
                {matches.map((stock) => (
                  <button
                    type="button"
                    key={stock.symbol}
                    className="flex w-full text-left items-center justify-between space-x-3 p-4 hover:bg-gray-50"
                    onClick={() => setSelected(stock)}
                  >
                    <span className="flex items-center space-x-3">
                      <span
                        className="bg-contain bg-center bg-no-repeat p-4 bg-gray-200 rounded"
                        style={{ backgroundImage: `url(${stock.logo})` }}
                      />
                      <span className="text-xs">
                        {stock.name} ({stock.symbol})
                      </span>
                    </span>
                    <span
                      className="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 bg-gray-100"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
            <div className="text-xs text-gray-500">
              {selected ? `${selected.symbol} market price` : "Market price"}
            </div>
            <div className="font-ibm text-sm font-bold">
              {details?.price != null
                ? `$${Number(details.price).toFixed(2)}`
                : selected
                ? "Loading…"
                : "—"}
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t">
            <div className="text-xs font-medium">Order type</div>
            <div className="grid grid-cols-3 gap-2">
              {["MARKET", "LIMIT", "STOP"].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={type === value}
                  onClick={() => {
                    setType(value);
                    if (value === "STOP") setExtended(false);
                  }}
                  className={`${
                    type === value
                      ? "bg-[#2D7EC2] text-white border-[#2D7EC2]"
                      : "bg-white text-gray-700 border-gray-300"
                  } rounded-md border px-3 py-1.5 text-xs font-medium capitalize`}
                >
                  {value.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          {type === "MARKET" ? (
            <label className="block text-xs space-y-2">
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
              <label className="text-xs">
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
              <label className="text-xs">
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
              <label className="text-xs col-span-2">
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
            <label className="flex gap-2 text-xs">
              <input
                type="checkbox"
                checked={sellAll}
                onChange={(e) => setSellAll(e.target.checked)}
              />
              Sell all holdings of this stock
            </label>
          )}
          {type !== "STOP" && (
            <div className="text-xs">
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
              <summary className="cursor-pointer text-xs font-bold text-wp-blue">
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
          <div className="space-y-3">
            <dl className="grid grid-cols-3 gap-3 text-2xs">
              <div>
                <dt className="font-semibold uppercase">Fee</dt>
                <dd>${quote.fee}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase">Order price</dt>
                <dd>${quote.order_price}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase">Shares</dt>
                <dd>{quote.quantity}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase">Total</dt>
                <dd>${quote.total_price}</dd>
              </div>
            </dl>
            <p className="text-2xs text-gray-500">
              {expired
                ? "Calculation expired. Calculate again."
                : `Valid for ${Math.max(
                    0,
                    Math.ceil((quote.expires_at * 1000 - now) / 1000)
                  )} seconds`}
            </p>
          </div>
        )}
        <div className="flex justify-between gap-3 pt-6">
          <button
            className="btn flex w-36 justify-between border-none bg-gray-600 hover:bg-gray-700 capitalize"
            disabled={busy || !selected || !details}
            type="submit"
          >
            {busy ? "Working…" : "Calculate"}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8"
              />
            </svg>
          </button>
          <button
            className="btn flex w-36 justify-between border-none bg-green-600 hover:bg-green-700 capitalize"
            type="button"
            onClick={place}
            disabled={busy || !quote || expired}
          >
            Complete
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </form>
    </ActionDialog>
  );
}

import { Fragment, useState, useEffect, useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";
import CurrencyInput from "react-currency-input-field";
import Spin from "../Misc/Spin";
import { toast } from "react-hot-toast";
import { bamboo, isCancelled } from "../../lib/bamboo";

const FIELDS_ERROR = "An error occured, make sure all fields are filled.";

export default function Trade({ accountId, showDep, toggleAdd, onSuccess }) {
  // `searchText` is what is typed; `query` is the text whose results are shown.
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState([]);
  const [searchStockLoading, setSearchStockLoading] = useState(false);
  const [selected, setSelectedStock] = useState(null);
  const [details, setDetails] = useState(null);
  const [s_amount, setAmount] = useState("");
  const [qty, setQty] = useState("");
  const [orderType, setOrderType] = useState("MARKET");
  const [limitPrice, setLimitPrice] = useState("");
  const [extendedHours, setExtendedHours] = useState(false);
  const [toggle, setSide] = useState(true);
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(null); // "calculate" | "place" | null
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const submission = useRef(false);
  const version = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Any edit invalidates the server-issued quote.
  useEffect(() => {
    ++version.current;
    setQuote(null);
  }, [selected, toggle, orderType, s_amount, qty, limitPrice, extendedHours, accountId]);

  // Tick only while a quote is displayed, to show its remaining validity.
  useEffect(() => {
    if (!quote) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [quote]);

  useEffect(() => {
    if (!selected) setSearchText("");
  }, [selected]);

  useEffect(() => {
    const text = searchText.trim();
    if (!text) {
      setQuery("");
      setStocks([]);
      setSearchStockLoading(false);
      return;
    }
    const controller = new AbortController();
    setSearchStockLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await bamboo("/stocks/search", {
          accountId,
          signal: controller.signal,
          data: { query: text },
        });
        if (controller.signal.aborted) return;
        setStocks(result?.result || []);
        setQuery(text);
      } catch (e) {
        if (!isCancelled(e)) toast.error(e.message);
      } finally {
        if (!controller.signal.aborted) setSearchStockLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchText, accountId]);

  useEffect(() => {
    setDetails(null);
    if (!selected?.symbol) return;
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
        if (!isCancelled(e)) toast.error(e.message);
      });
    return () => controller.abort();
  }, [selected, accountId]);

  const setToggle = (value) => {
    if (!busy) setSide(value);
  };
  const setSelected = (stock) =>
    setSelectedStock(stock && Object.keys(stock).length ? stock : null);
  const setSelStock = setSelected;
  const selStock = selected || {};
  const handleStockQuery = (e) => setSearchText(e.target.value);
  const filteredStocks = stocks;
  const currentStockData = details || {};
  const loadingCurrentStock = !!selected && !details;
  const calcData = quote || {};
  const expired = !!quote && quote.expires_at * 1000 <= now;
  const completeButton = !!quote && !expired && !busy;
  const loading = busy === "calculate";
  const loadingC = busy === "place";

  const closeDialog = () => {
    if (!busy) toggleAdd();
  };

  /**
   * CALCULATE ORDER (server-issued, expiring quote)
   */
  const calculateOrder = async () => {
    setError("");
    if (submission.current) return;
    if (!selected) return setError(FIELDS_ERROR);
    if (!details) {
      toast.error("Market price is still loading. Please wait.");
      return;
    }

    const priceNum = parseFloat(details.price) || 0;
    const qtyNum = parseFloat(qty) || 0;
    const amountNum = parseFloat(s_amount) || 0;
    const limitPriceNum = parseFloat(limitPrice) || 0;

    let input;
    if (orderType === "LIMIT") {
      if (qtyNum <= 0 || limitPriceNum <= 0) return setError(FIELDS_ERROR);
      if (extendedHours && !Number.isInteger(qtyNum)) {
        toast.error(
          "Extended hours requires whole-unit quantities (no fractional shares)."
        );
        return;
      }
      input = {
        symbol: selected.symbol,
        side: toggle ? "BUY" : "SELL",
        order_type: "LIMIT",
        price_per_share: priceNum,
        price: limitPriceNum,
        quantity: qtyNum,
        extended_hours_order: extendedHours,
      };
    } else {
      const finalAmount =
        Math.round((qtyNum > 0 ? qtyNum * priceNum : amountNum) * 100) / 100;
      if (finalAmount <= 0) return setError(FIELDS_ERROR);
      input = {
        symbol: selected.symbol,
        side: toggle ? "BUY" : "SELL",
        order_type: "MARKET",
        amount: finalAmount,
      };
    }

    submission.current = true;
    setBusy("calculate");
    const current = version.current;
    try {
      const result = await bamboo("/orders/calculate", {
        method: "POST",
        accountId,
        data: input,
      });
      if (alive.current && current === version.current) setQuote(result);
    } catch (e) {
      if (alive.current) toast.error(e.message || "Calculation failed.");
    } finally {
      submission.current = false;
      if (alive.current) setBusy(null);
    }
  };

  const completeOrder = async () => {
    if (submission.current || !quote) return;
    if (quote.expires_at * 1000 <= Date.now()) {
      setQuote(null);
      toast.error("Calculation expired. Calculate again.");
      return;
    }
    submission.current = true;
    setBusy("place");
    try {
      const operation = await bamboo("/orders", {
        method: "POST",
        accountId,
        data: { quote_id: quote.quote_id },
      });
      toast.success(
        `Order placed successfully.${
          operation?.status ? ` Status: ${operation.status}.` : ""
        }`
      );
      if (alive.current) setQuote(null);
      onSuccess?.();
      toggleAdd();
    } catch (e) {
      toast.error(e.message || "An error occured.");
      if (alive.current && e.code === "quote_expired") setQuote(null);
    } finally {
      submission.current = false;
      if (alive.current) setBusy(null);
    }
  };

  const Error = () => {
    return (
      <div className="flex text-red-700 items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="text-2xs">{error}</div>
      </div>
    );
  };

  return (
    <Transition appear show={showDep} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeDialog}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`lg:w-1/4 md:w-1/2 w-full mx-10 md:mx-0 flex flex-col justify-between transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all`}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-2">
                    <div
                      onClick={() => setToggle(true)}
                      className={`${
                        !toggle && `opacity-20`
                      } bg-blue-50 grid border-b-2 cursor-pointer border-[#2D7EC2]`}
                    >
                      <div className="mx-auto my-6 text-[#2D7EC2] text-xl font-semibold">
                        Buy
                      </div>
                    </div>

                    <div
                      onClick={() => setToggle(false)}
                      className={`${
                        toggle && `opacity-20`
                      } bg-red-50 grid border-b-2 cursor-pointer border-red-600`}
                    >
                      <div className="mx-auto my-6 text-xl font-semibold text-red-600">
                        Sell
                      </div>
                    </div>
                  </div>
                  {/* {JSON.stringify(allocStatus)} */}
                  <div className="px-6 space-y-6">
                    <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                      <h3
                        className="text-sm font-bold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Search for a stock
                      </h3>
                      <svg
                        onClick={closeDialog}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 cursor-pointer fill-current text-gray-500 hover:text-gray-800"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {error && <Error />}

                    {!Object.keys(selStock).length && (
                      <div>
                        {/** Search stocks */}
                        <div
                          className={`${
                            query ? `rounded-t-lg` : `rounded-lg`
                          } border border-gray-300 px-3`}
                        >
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 stroke-current text-wp-blue"
                              viewBox="0 0 24 24"
                              fill="none"
                              // xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17 17L22 22M19.5 10.75C19.5 15.5825 15.5825 19.5 10.75 19.5C5.91751 19.5 2 15.5825 2 10.75C2 5.91751 5.91751 2 10.75 2C15.5825 2 19.5 5.91751 19.5 10.75Z"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                            <div className="flex w-full items-center justify-between space-x-3">
                              <input
                                type="text"
                                onChange={handleStockQuery}
                                placeholder="SYMBOL (ex. TSLA)"
                                className="text-md w-full bg-transparent ring-0 outline-none ring-0 border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
                              />
                            </div>
                            {searchStockLoading && <Spin w={20} h={20} />}
                          </div>
                        </div>

                        {/** Stock list */}
                        {query && (
                          <div className="border-gray-300 max-h-48 overflow-auto rounded-b-xl border-b border-r border-l">
                            {filteredStocks.map((s) => (
                              <div
                                key={s?.symbol}
                                className=" flex items-center justify-between space-x-3 p-4"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className="bg-contain bg-center bg-no-repeat p-4 bg-gray-200 rounded"
                                    style={{
                                      backgroundImage: `url(${s?.logo})`,
                                    }}
                                  ></div>
                                  <div className="text-sm">
                                    {s?.name} ({s?.symbol})
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    value={s?.symbol}
                                    onChange={(e) => {
                                      setSelected(s);
                                      setSelStock(s);
                                    }}
                                    name="stock"
                                    className="h-6 w-6 border-gray-300 bg-gray-100 text-gray-600 focus:ring-0"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {Object.keys(selStock).length > 0 && (
                      <div className="border rounded-lg border-gray-300 px-3 py-1">
                        <div className="flex items-center space-x-3">
                          <svg
                            className="w-6 h-6 stroke-current text-wp-blue"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17 17L22 22M19.5 10.75C19.5 15.5825 15.5825 19.5 10.75 19.5C5.91751 19.5 2 15.5825 2 10.75C2 5.91751 5.91751 2 10.75 2C15.5825 2 19.5 5.91751 19.5 10.75Z"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                          <div className="flex w-full items-center justify-between space-x-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className="bg-contain bg-center bg-no-repeat bg-gray-200 p-4 text-xl"
                                style={{
                                  backgroundImage: `url(${selStock?.logo})`,
                                }}
                              ></div>
                              <div className="text-sm">
                                {selStock?.name} ({selStock?.symbol})
                              </div>
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                setSelected("");
                                setQuery("");
                                setSelStock({});
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16 8L12 12M12 12L8 16M12 12L8 8M12 12L16 16"
                                  stroke="#ED6464F2"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="#ED6464F2"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></circle>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                      <div className="text-xs text-gray-500">
                        {currentStockData?.symbol
                          ? `${currentStockData.symbol} market price`
                          : "Market price"}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="font-ibm text-sm font-bold">
                          {currentStockData?.price
                            ? `$${parseFloat(currentStockData.price).toFixed(2)}`
                            : "—"}
                        </div>
                        {loadingCurrentStock && <Spin w={14} h={14} />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs">Amount</div>
                          {parseFloat(qty) > 0 && (
                            <div className="text-2xs text-gray-400">
                              Overridden
                            </div>
                          )}
                        </div>
                        <CurrencyInput
                          name="s_amount"
                          placeholder="$"
                          decimalsLimit={2}
                          onValueChange={(value, name) => setAmount(value)}
                          disabled={parseFloat(qty) > 0}
                          className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs">Qty (shares)</div>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          placeholder="e.g. 5"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        />
                      </div>
                    </div>

                    {qty && parseFloat(qty) > 0 && currentStockData?.price > 0 && (
                      <div className="-mt-1 text-2xs text-gray-500">
                        ≈ ${(parseFloat(qty) * parseFloat(currentStockData.price)).toFixed(2)} at current price
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t">
                      <div className="text-xs font-medium">Order type</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOrderType("MARKET");
                            setExtendedHours(false);
                          }}
                          className={`${
                            orderType === "MARKET"
                              ? "bg-[#2D7EC2] text-white border-[#2D7EC2]"
                              : "bg-white text-gray-700 border-gray-300"
                          } rounded-md border px-3 py-1.5 text-xs font-medium`}
                        >
                          Market
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderType("LIMIT");
                          }}
                          className={`${
                            orderType === "LIMIT"
                              ? "bg-[#2D7EC2] text-white border-[#2D7EC2]"
                              : "bg-white text-gray-700 border-gray-300"
                          } rounded-md border px-3 py-1.5 text-xs font-medium`}
                        >
                          Limit
                        </button>
                      </div>
                    </div>

                    {orderType === "LIMIT" && (
                      <div className="space-y-2">
                        <div className="text-xs">Limit price</div>
                        <CurrencyInput
                          name="limitPrice"
                          placeholder="$"
                          decimalsLimit={2}
                          value={limitPrice}
                          onValueChange={(value) => setLimitPrice(value ?? "")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        />
                        <div className="text-2xs text-gray-500 leading-snug">
                          Order executes only when the market reaches this
                          price. Limit orders are <b>Good Till Cancelled</b>{" "}
                          (default 90 days).
                        </div>
                      </div>
                    )}

                    {orderType === "LIMIT" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <div className="text-xs font-medium">
                              Extended hours
                            </div>
                            <div className="relative group">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 text-gray-400 cursor-help"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-64 rounded-md bg-gray-900 px-3 py-2 text-2xs text-white leading-snug opacity-0 transition-opacity group-hover:opacity-100 shadow-lg">
                                Bamboo only supports extended-hours trading on{" "}
                                <b>LIMIT orders</b> with <b>whole-unit</b>{" "}
                                (non-fractional) quantities. Market and stop
                                orders, and fractional shares, aren&apos;t
                                allowed outside regular hours.
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExtendedHours(!extendedHours)}
                            className={`${
                              extendedHours ? "bg-[#2D7EC2]" : "bg-gray-300"
                            } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
                            aria-pressed={extendedHours}
                          >
                            <span
                              className={`${
                                extendedHours
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                            />
                          </button>
                        </div>
                        <div className="text-2xs text-gray-500 leading-snug">
                          Trade during pre-market (9:00 AM–2:30 PM WAT) or
                          post-market (9:00 PM–1:00 AM WAT). Add 1 hour during
                          US winter (Nov–Mar).
                        </div>
                      </div>
                    )}

                    {/**
                     * Allocate
                     */}
                    {/* {!allocStatus && (
                      <div className="flex">
                        <div
                          onClick={() => setAllocStatus(false)}
                          className="hover:opacity-80 cursor-pointer rounded-full bg-wp-blue p-2 grid place-items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => setAllocStatus(true)}
                      className="flex cursor-pointer hover:opacity-80 items-center justify-between border-b pb-3"
                    >
                      <div className="text-xs font-bold text-wp-blue ">
                        Allocate
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-4 h-4 ${allocStatus && `rotate-90`}`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>

                    {!allocStatus && (
                      <div className="relative rounded-md">
                        <div className="">
                          <div>
                            <div id="client_list" className="space-y-4">
                              {subAccounts.map((a) => (
                                <div
                                  key={a?.id}
                                  className="flex items-center justify-between"
                                >
                                  <p className="font-semibold text-sm">
                                    {a?.name}
                                  </p>
                                  <input
                                    className="mt-1 uppercase block w-20 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                    type="text"
                                    onChange={(e) =>
                                      setAllocData({
                                        ...allocData,
                                        [a?.slug]: e.target.value,
                                      })
                                    }
                                    name={a?.slug}
                                    placeholder="%"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div id="rem_allocation" className="rounded pt-8">
                            <div className="flex items-center justify-between rounded-md bg-[#2D7EC2] px-3 py-2 text-white">
                              <p className="font-bold text-xs">
                                Remaining Allocation
                              </p>
                              <div className="flex items-center justify-between rounded-md border-none">
                                <p className="pr-2">{100 - allocTotal} %</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid place-items-end pt-4">
                            <div className="py-1 shadow-md hover:opacity-70 text-white flex space-x-1 items-center px-2 bg-[#2D7EC2] border-blue-800 cursor-pointer border rounded-md">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 4.5c1.215 0 2.417.055 3.604.162a.68.68 0 01.615.597c.124 1.038.208 2.088.25 3.15l-1.689-1.69a.75.75 0 00-1.06 1.061l2.999 3a.75.75 0 001.06 0l3.001-3a.75.75 0 10-1.06-1.06l-1.748 1.747a41.31 41.31 0 00-.264-3.386 2.18 2.18 0 00-1.97-1.913 41.512 41.512 0 00-7.477 0 2.18 2.18 0 00-1.969 1.913 41.16 41.16 0 00-.16 1.61.75.75 0 101.495.12c.041-.52.093-1.038.154-1.552a.68.68 0 01.615-.597A40.012 40.012 0 0110 4.5zM5.281 9.22a.75.75 0 00-1.06 0l-3.001 3a.75.75 0 101.06 1.06l1.748-1.747c.042 1.141.13 2.27.264 3.386a2.18 2.18 0 001.97 1.913 41.533 41.533 0 007.477 0 2.18 2.18 0 001.969-1.913c.064-.534.117-1.071.16-1.61a.75.75 0 10-1.495-.12c-.041.52-.093 1.037-.154 1.552a.68.68 0 01-.615.597 40.013 40.013 0 01-7.208 0 .68.68 0 01-.615-.597 39.785 39.785 0 01-.25-3.15l1.689 1.69a.75.75 0 001.06-1.061l-2.999-3z"
                                  clipRule="evenodd"
                                />
                              </svg>

                              <div onClick={calcTotal} className=" text-xs">
                                Calc
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {Object.keys(calcData).length > 0 && (
                      <div className="text-2xs flex space-x-3 gap-2">
                        <div>
                          <div className="font-semibold uppercase">fee</div>
                          <div>{calcData?.fee}</div>
                        </div>

                        <div>
                          <div className="font-semibold uppercase">
                            order price
                          </div>
                          <div>{calcData?.order_price}</div>
                        </div>

                        <div>
                          <div className="font-semibold uppercase">
                            Price Per Share
                          </div>
                          <div>{calcData?.price_per_share}</div>
                        </div>

                        {/* <div>
                          <div className="font-semibold uppercase">qty</div>
                          <div>{calcData?.quantity}</div>
                        </div> */}
                      </div>
                    )}

                    {quote && (
                      <div className="-mt-3 text-2xs text-gray-500">
                        {expired
                          ? "Calculation expired. Calculate again."
                          : `Valid for ${Math.max(
                              0,
                              Math.ceil((quote.expires_at * 1000 - now) / 1000)
                            )} seconds`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex p-6 justify-between">
                  <button
                    onClick={calculateOrder}
                    disabled={busy ? true : false}
                    className="btn flex w-36 mt-6 justify-between place-self-end border-none bg-gray-600 hover:bg-gray-700 capitalize"
                  >
                    {loading ? <Spin /> : <div>Calculate</div>}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={completeOrder}
                    disabled={completeButton ? false : true}
                    className="btn flex w-36 mt-6 justify-between place-self-end border-none bg-green-600 hover:bg-green-700 capitalize"
                  >
                    {loadingC ? <Spin /> : <div>Complete</div>}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

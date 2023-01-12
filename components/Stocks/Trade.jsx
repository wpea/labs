import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog, Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import CurrencyInput from "react-currency-input-field";
import Spin from "../Misc/Spin";
import { config } from "../../lib/adapter";
import axios from "axios";
import { toast } from "react-hot-toast";
import { bambooLive, apiAddress } from "../../lib/api";

export default function Deposit({ showDep, toggleAdd }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingC, setLoadingC] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState({});
  const [symbol, setSymbol] = useState("");
  const [s_amount, setAmount] = useState(0);
  const [calcData, setCalcData] = useState({});
  const [stopPrice, setStopPrice] = useState(0);
  const [error, setError] = useState(false);
  const [completeButton, setCompleteButton] = useState(false);
  const [selStock, setSelStock] = useState({});

  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    getStocks();
  }, []);

  const config2 = (method, url, jwt) => {
    return {
      method: method,
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: { jwt: jwt },
    };
  };

  const config3 = (method, url, data) => {
    return {
      method: method,
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: data,
    };
  };

  /**
   * GET STOCKS
   */
  const getStocks = async () => {
    // setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    // const res = await axios(
    //   config(
    //     "get",
    //     `${bambooLive}/api/stocks?limit=1000`,
    //     user.jwt
    //   )
    // );

    /**
     * GET STOCKS
     */
    axios(config2(`post`, `${apiAddress}/stock/get/all`, user.jwt))
      .then(function (response) {
        if (response.data.status === 200) {
          console.log(response);
          setStocks(response.data.data.stocks);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  /**
   * CALCULATE ORDER
   *
   */
  const calculateOrder = async () => {
    if (Object.keys(selected).length === 0) return setError(true);
    if (s_amount === 0 && stopPrice === 0) return setError(true);

    setLoading(false);

    // return console.log(selected);

    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      symbol: selected.symbol,
      side: "BUY",
      price: JSON.parse(stopPrice),
      order_type: "MARKET",
      amount: JSON.parse(s_amount),
      jwt: user.jwt,
    };

    // const res = await axios(
    //   config(
    //     "post",
    //     `${bambooLive}/api/order/calculate`,
    //     user.jwt,
    //     data
    //   )
    // );

    axios(config3(`post`, `${apiAddress}/stock/calculate/order`, data))
      .then(function (response) {
        if (response.data.status === 200) {
          console.log(response);
          setCalcData(response.data.data);
          setCompleteButton(true);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });

    // console.log(res);

    // if (res.status === 200) {
    //   setCalcData(res.data);
    //   setCompleteButton(true);
    // } else {
    //   toast.error(res?.message);
    // }
  };

  const completeOrder = async () => {
    setLoadingC(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      total_price: calcData.total_price,
      symbol: selected.symbol,
      side: toggle ? "BUY" : "SELL",
      quantity: calcData.quantity,
      order_price: calcData.order_price,
      order_type: "MARKET",
      price_per_share: calcData.price_per_share,
      fee: calcData.fee,
      jwt: user.jwt,
    };

    axios(config3(`post`, `${apiAddress}/stock/order/complete`, data))
      .then(function (response) {
        if (response.data.status === 200) {
          console.log(response);
          toast.success(
            `Order placed successfully. ${response?.data?.data?.order_id}`
          );
          setLoadingC(false);
          toggleAdd();
        }

        if (response.data.status !== 200) {
          toast.error(response.data.message ?? "An error occured.");
          console.log(response);
          setLoadingC(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoadingC(false);
      });

    // try {
    //   const res = await axios(
    //     config3("post", `${apiAddress}/stock/order/complete`, data)
    //   );

    //   if (res.status === 200) {
    //     console.log(res?.data);
    //     // toast.success(`Order placed successfully. ${res?.data?.order_id}`);
    //     // setCompleteButton(true);
    //     // toggleAdd();
    //   }

    //   if (res.status !== 200) {
    //     toast.error(res.message ?? `An error occured.`);
    //   }

    // } catch (e) {
    //   console.log("error", e?.response?.data?.message);
    //   toast.error(e?.response?.data?.message);
    //   setLoadingC(false);
    // }

    // setLoadingC(false);
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
        <div className="text-2xs">
          An error occured, make sure all fields are filled.
        </div>
      </div>
    );
  };

  /**
   * COMBO BOX DATA
   *
   */
  const filteredStocks =
    query === ""
      ? stocks
      : stocks.filter((s) =>
          s.symbol
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Transition appear show={showDep} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={toggleAdd}>
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
                className={`w-1/4 flex flex-col justify-between transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all`}
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

                  <div className="px-6 space-y-6">
                    <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                      <h3
                        className="text-sm font-bold capitalize leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Select a stock
                      </h3>
                      <svg
                        onClick={toggleAdd}
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

                    {/* <Combobox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-wp-blue sm:text-sm">
                          <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(s) => s.name}
                            onChange={(event) => setQuery(event.target.value)}
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <SelectorIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setQuery("")}
                        >
                          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredStocks.length === 0 && query !== "" ? (
                              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                              </div>
                            ) : (
                              filteredStocks.map((s) => (
                                <Combobox.Option
                                  key={s.symbol}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-wp-blue text-white"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={s}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center space-x-3">
                                        <span>
                                          <img
                                            src={s?.logo}
                                            className="w-6 h-6"
                                          />
                                        </span>

                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {s?.name}
                                        </span>
                                      </div>
                                      {selected ? (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active
                                              ? "text-white"
                                              : "text-wp-blue"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))
                            )}
                          </Combobox.Options>
                        </Transition>
                      </div>
                    </Combobox> */}

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
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SYMBOL (ex. TSLA)"
                                className="text-md w-full bg-transparent ring-0 outline-none ring-0 border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
                              />
                            </div>
                          </div>
                        </div>

                        {/** Stock list */}
                        {query && (
                          <div className="border-gray-300 max-h-48 overflow-auto rounded-b-xl border-b border-r border-l">
                            {filteredStocks.map((s) => (
                              <div key={s?.symbol} className=" flex items-center justify-between space-x-3 p-4">
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

                    <div className="space-y-2">
                      <div className="text-xs">Stop Price / Limit Price</div>
                      <CurrencyInput
                        name="stopPrice"
                        // defaultValue={amount}
                        placeholder="$"
                        decimalsLimit={2}
                        onValueChange={(value, name) => setStopPrice(value)}
                        required
                        className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs">Amount</div>
                      <CurrencyInput
                        name="s_amount"
                        // defaultValue={amount}
                        placeholder="$"
                        decimalsLimit={2}
                        onValueChange={(value, name) => setAmount(value)}
                        required
                        className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>

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
                  </div>
                </div>

                <div className="flex p-6 justify-between">
                  <button
                    onClick={calculateOrder}
                    disabled={loading ? true : false}
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

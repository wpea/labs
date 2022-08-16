import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog, Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import CurrencyInput from "react-currency-input-field";
import Spin from '../Misc/Spin';
import { config } from "../../lib/adapter";
import axios from 'axios';

export default function Deposit({ showDep, toggleAdd }) {
const [query, setQuery] = useState("");
const [loading, setLoading] = useState(false);
const [stocks, setStocks] = useState([]);
const [selected, setSelected] = useState('');
const [symbol, setSymbol] = useState('');
const [s_amount, setAmount] = useState(0);
const [calcData, setCalcData] = useState({})

  useEffect(() => {
    getStocks();
  }, []);

  /**
   * GET STOCKS
   */
  const getStocks = async () => {
    // setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios(
      config(
        "get",
        "https://powered-by-bamboo-sandbox.investbamboo.com/api/stocks?limit=180",
        user.jwt
      )
    );

    // console.log(res);
    if (res.status === 200) setStocks(res.data.stocks);
    // setLoading(false);
  };

  /**
   * CALCULATE ORDER
   * 
   */
  const calculateOrder = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      symbol: selected.symbol,
      side: "BUY",
      price: JSON.parse(s_amount),
      order_type: "MARKET",
      amount:  JSON.parse(s_amount),
    };

    const res = await axios(
      config(
        "post",
        "https://powered-by-bamboo-sandbox.investbamboo.com/api/order/calculate",
        user.jwt,
        data
      )
    );

    console.log(res);
    if (res.status === 200) setCalcData(res.data);
    setLoading(false);
  };




  /** 
   * COMBO BOX DATA
   *
   */
  const filteredStocks =
    query === ""
      ? stocks
      : stocks.filter((s) =>
          s.name
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
                className={`w-1/4 h-96 flex flex-col justify-between transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <div className="space-y-6">
                  <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                    <h3
                      className="text-lg font-bold capitalize leading-6 text-gray-900"
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

                  <Combobox value={selected} onChange={setSelected}>
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
                                          active ? "text-white" : "text-wp-blue"
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
                  </Combobox>

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
                        <div className="font-semibold uppercase">Price Per Share</div>
                        <div>{calcData?.price_per_share}</div>
                      </div>

                      <div>
                        <div className="font-semibold uppercase">qty</div>
                        <div>{calcData?.quantity}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={calculateOrder}
                    disabled={loading ? true : false}
                    className="btn flex w-36 justify-between place-self-end border-none bg-green-600 hover:bg-green-700 capitalize"
                  >
                    {loading ? <Spin /> : <div>Calculate</div>}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8"
                      />
                    </svg>
                  </button>
                </div>

                {/* <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-xs">Amount</div>
                    <CurrencyInput
                      name="amount"
                      // defaultValue={amount}
                      placeholder="$"
                      decimalsLimit={2}
                      onValueChange={(value, name) => setAmount(value)}
                      required
                      className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs">Amount</div>
                    <CurrencyInput
                      name="amount"
                      // defaultValue={amount}
                      placeholder="$"
                      decimalsLimit={2}
                      onValueChange={(value, name) => setAmount(value)}
                      required
                      className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                    />
                  </div>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import axios from "axios";
import { genpost } from "../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AddStock({ toggleAdd, status, data, button }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    buy_price: "",
    shares: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddStock = (e) => {
    e.preventDefault();

    // check for duplicates
    const filtered = stocks.filter((s) => s.symbol === formData.symbol);
    if (filtered.length > 0) {
      return setDuplicateError(true);
    }

    setStocks([...stocks, formData]);
    setDuplicateError(false);

    setFormData({
      symbol: "",
      buy_price: "",
      shares: "",
    });
  };

  const removeStock = (symbol) => {
    const filtered = stocks.filter((s) => s.symbol !== symbol);
    setStocks(filtered);
  };

  const commitStocks = async () => {
    setLoading(true);
    const res = await genpost(
      `/stocks/add/multiple`,
      JSON.stringify({ stocks: JSON.stringify(stocks) }),
      localStorage.getItem("token")
    );
    const data = await res.json();

    if (data?.errors?.length > 0) {
      toast.error("An error occured.");
      setLoading(false);
    } else {
      toast.success("Stock(s) added successfully.");
      toggleAdd();
      setLoading(false);
    }
  };

  return (
    <Transition appear show={status} as={Fragment}>
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

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <form onSubmit={handleAddStock} className="space-y-6">
                  <div className="space-y-4 bg-white ">
                    <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                      <h3
                        className="text-lg font-bold capitalize leading-6 text-gray-900"
                        id="modal-title"
                      >
                        add a new stock
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

                    <div className="sm:items-start">
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="bg-white">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                              <label className="block text-sm font-medium text-gray-700">
                                Stock Symbol (eg. TSLA, MSFT, GOOG)
                              </label>
                              <input
                                type="text"
                                name="symbol"
                                required
                                value={formData.symbol}
                                onChange={handleChange}
                                className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                              />
                            </div>

                            <div className="col-span-6 grid grid-cols-2 gap-8">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Buy Price
                                </label>
                                <input
                                  type="text"
                                  name="buy_price"
                                  required
                                  value={formData.buy_price}
                                  onChange={handleChange}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Shares
                                </label>
                                <input
                                  type="text"
                                  name="shares"
                                  value={formData.shares}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>
                            </div>

                            {duplicateError && (
                              <div className="text-red-500 text-2xs col-span-6">
                                Already added.
                              </div>
                            )}

                            {stocks.length > 0 ? (
                              <div className="h-36 col-span-6 space-y-3 scrollbar scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 overflow-hidden overflow-y-scroll	">
                                {stocks.map((s) => (
                                  <div
                                    key={s.symbol}
                                    className="bg-gray-100 p-3 rounded-md col-span-6 w-full flex items-center justify-between"
                                  >
                                    <div className="space-x-4 items-center flex">
                                      <div className="uppercase flex items-center space-x-2">
                                        <div className="text-2xs text-gray-400">
                                          symbol
                                        </div>
                                        <div>{s.symbol}</div>
                                      </div>
                                      <div className="place-self-center uppercase flex items-center space-x-2">
                                        <div className="text-2xs text-gray-400">
                                          bp
                                        </div>
                                        <div>{s.buy_price}</div>
                                      </div>
                                      <div className="uppercase flex items-center space-x-2">
                                        <div className="text-2xs text-gray-400">
                                          shares
                                        </div>
                                        <div>{s.shares}</div>
                                      </div>
                                    </div>

                                    <div>
                                      <svg
                                        onClick={() => removeStock(s.symbol)}
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
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs col-span-6 text-center text-gray-400">
                                Add a stock to get started.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      // onClick={button}
                      className="btn bg-cyan-600 border-none hover:bg-cyan-800 btn-sm"
                    >
                      + Add
                    </button>

                    <button
                      onClick={commitStocks}
                      type="button"
                      className={`btn btn-sm ${loading && `loading`}`}
                      disabled={stocks.length > 0 ? false : true}
                    >
                      Complete
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

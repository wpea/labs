import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";

export default function AddStock({ toggleAdd, status, data, button }) {
  // const [data, setData] = useState({
  //   symbol: "",
  //   buy_price: "",
  //   shares: "",
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };
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
                <div className="space-y-6">
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
                                value={data.symbol}
                                onChange={data}
                                autoComplete="given-name"
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
                                  value={data.buy_price}
                                  onChange={data}
                                  autoComplete="given-name"
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
                                  value={data.shares}
                                  onChange={data}
                                  autoComplete="given-name"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      onClick={button}
                      className="focus:ring-none inline-flex w-full justify-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-0 sm:w-auto sm:text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={toggleAdd}
                      type="button"
                      className="focus:ring-none mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

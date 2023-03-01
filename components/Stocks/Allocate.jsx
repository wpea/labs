import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import CurrencyInput from "react-currency-input-field";
import { config } from "../../lib/adapter";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spin from "../Misc/Spin";
import { useRouter } from "next/router";
import { apiAddress, bambooLive } from "../../lib/api";

export default function Allocate({ show, toggle, stockValues }) {
  const [subAccounts, setSubAccounts] = useState([]);
  const [allocData, setAllocData] = useState({});
  const [loading, setLoading] = useState(false);

  const completeAllocate = async (e) => {
    e.preventDefault();

    if (!Object.keys(allocData).length) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${apiAddress}/stock/subs/allocate`,
        {
          data: JSON.stringify(allocData),
          symbol: stockValues?.symbol,
          total_price: stockValues?.equity_value,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      getSubAccounts();
      toast.success('Allocations updated.');
      setLoading(false);
      toggle();
    } catch (e) {
      console.log(e);
      toast.error("An error occured");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubAccounts();
    setAllocData({});
  }, [toggle]);

  const getSubAccounts = async () => {
    try {
      const res = await axios.get(`${apiAddress}/stock/get/subs`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      setSubAccounts(res?.data?.data);
    } catch (e) {
      console.log(e.response);
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={toggle}>
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
                className={`w-1/4 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <form onSubmit={completeAllocate} className="space-y-12">
                  <div className="space-y-4 bg-white">
                    <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                      <h3
                        className="text-lg font-bold capitalize leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Allocate (%)
                      </h3>
                      <svg
                        onClick={toggle}
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
                   
                    <div>
                      {/* <p className="pb-3">Re-allocation</p> */}
                      <div id="client_list" className="space-y-4">
                        {subAccounts?.map((a) => (
                          <div
                            key={a?.id}
                            className="flex items-center justify-between"
                          >
                            <p className="font-semibold text-sm">{a?.name}</p>
                            <CurrencyInput
                              type="text"
                              name={a?.slug}
                              onChange={(e) =>
                                setAllocData({
                                  ...allocData, 
                                  [a?.slug]: e.target.value,
                                  
                                  }
                                )
                              }
                              placeholder="$"
                              className="mt-1 uppercase block w-20 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid place-items-end">
                    <button
                      type="submit"
                      className="btn flex w-36 mt-6 justify-between place-self-end border-none bg-green-600 hover:bg-green-700 capitalize"
                    >
                      {loading ? <Spin /> : <div>Complete</div>}
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
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

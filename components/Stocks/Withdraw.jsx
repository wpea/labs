import { Fragment, useState, useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";
import CurrencyInput from "react-currency-input-field";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import Spin from "../Misc/Spin";
import { bamboo } from "../../lib/bamboo";

// Bamboo tenant withdrawals settle to the tenant's configured payout account,
// so the legacy per-user bank selection and "new account" controls (backed by
// the retired /stocks/bank/* and Mono endpoints) are intentionally absent.
export default function Withdraw({ accountId, showDep, toggleAdd, onSuccess }) {
  const [reference, setReference] = useState(uuid);
  const [sData, setSData] = useState({ amount: "", currency: "" });
  const [loading, setLoading] = useState(false);
  const [aError, setAError] = useState("");
  const [cError, setCError] = useState(false);
  const [unknown, setUnknown] = useState(false);
  const [rejected, setRejected] = useState(false);
  const submitting = useRef(false);

  const closeDialog = () => {
    if (!loading) toggleAdd();
  };

  const startNewRequest = () => {
    setReference(uuid());
    setSData({ amount: "", currency: "" });
    setUnknown(false);
    setRejected(false);
    setAError("");
    setCError(false);
  };

  /**
   *
   * COMPLETE
   * WITHDRAWAL
   *
   */
  const completeWithdrawal = async (e) => {
    e.preventDefault();
    if (submitting.current || unknown || rejected) return;

    const amount = Number(sData.amount);
    if (!(amount > 0) || !Number.isInteger(amount)) {
      return setAError("Enter a whole-unit amount");
    }
    setAError("");

    if (!sData.currency) {
      return setCError(true);
    }
    setCError(false);

    submitting.current = true;
    setLoading(true);

    try {
      await bamboo("/withdrawals", {
        method: "POST",
        accountId,
        data: { reference, amount, currency: sData.currency, market: "US" },
      });
      toast.success("Withdrawal in progress.");
      startNewRequest();
      onSuccess?.();
      toggleAdd();
    } catch (e) {
      toast.error(e.message);
      if (
        e.code === "outcome_unknown" ||
        !e.response ||
        e.response?.status >= 500
      ) {
        setUnknown(true);
      } else if (
        e.code === "upstream_error" ||
        e.code === "previously_rejected"
      ) {
        setRejected(true);
      }
    } finally {
      submitting.current = false;
      setLoading(false);
    }
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
                className={`w-1/4 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <form onSubmit={completeWithdrawal} className="space-y-12">
                  <div className="space-y-4 bg-white">
                    <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                      <h3
                        className="text-lg font-bold capitalize leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Withdraw Funds
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

                    <div className="sm:items-start">
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="bg-white">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 space-y-3">
                              <div className="text-xs">Amount</div>
                              <CurrencyInput
                                type="text"
                                name="amount"
                                required
                                allowDecimals={false}
                                value={sData.amount}
                                disabled={unknown || rejected}
                                onValueChange={(value) =>
                                  setSData({ ...sData, amount: value ?? "" })
                                }
                                placeholder="$"
                                className="mt-1 block w-full rounded-md border-gray-300 uppercase shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                              />
                              {aError && (
                                <div className="text-2xs text-red-500">
                                  {aError}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="cap text-xs">Select Currency</div>
                      <select
                        name="currency"
                        value={sData.currency}
                        disabled={unknown || rejected}
                        onChange={(e) =>
                          setSData({ ...sData, currency: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                      >
                        <option value="">Select</option>
                        <option>USD</option>
                        <option>NGN</option>
                      </select>

                      {cError && (
                        <div className="text-2xs text-red-500">
                          Select a currency
                        </div>
                      )}
                    </div>

                    {unknown && (
                      <div className="text-2xs text-red-500">
                        Reference: {reference}. Check Withdrawals before
                        creating another request.
                      </div>
                    )}

                    <div className="sm:items-start">
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="bg-white grid grid-cols-2">
                          <button
                            disabled={
                              loading || unknown || rejected ? true : false
                            }
                            type="submit"
                            className="btn flex w-36 justify-between border-none bg-green-600 capitalize hover:bg-green-700"
                          >
                            Complete
                            {!loading ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <Spin />
                            )}
                          </button>

                          {rejected && (
                            <div className="grid justify-end">
                              <div
                                onClick={startNewRequest}
                                className="place-self-center hover:opacity-80 cursor-pointer space-x-2 flex items-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 text-blue-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="text-2xs font-medium tracking-wide uppercase">
                                  new request
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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

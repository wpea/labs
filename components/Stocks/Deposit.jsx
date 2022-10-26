import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import CurrencyInput from "react-currency-input-field";
import { config } from "../../lib/adapter";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spin from '../Misc/Spin';
import { useRouter } from 'next/router';
import { bambooLive } from "../../lib/api";

export default function Deposit({ showDep, toggleAdd }) {
  const [amount, setAmount] = useState(0);
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const setPaymentMethod = (type) => {
    setMethod(type);
  };

  const [stepOne, setStepOne] = useState(true);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);

  const setStep = (which) => {
    if (which === 1) {
      setStepOne(true);
      setStepTwo(false);
      setStepThree(false);
    }

    if (which === 2) {
      setStepOne(false);
      setStepTwo(true);
      setStepThree(false);
    }

    if (which === 3) {
      setStepOne(false);
      setStepTwo(false);
      setStepThree(true);
    }
  };

  const submitStepOne = async (e) => {
    e.preventDefault();

    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axios(
      config(
        "get",
        `${bambooLive}/api/deposit/payment_methods?amount=${amount}.00`,
        user.jwt
      )
    );

    setMethods(res.data.payment_methods);

    console.log(res);

    setStep(2);

    setLoading(false);
  };

  const generatePaymentLink = async () => {
    setLoading(true);

    var data = `{"payment_method_id":${method},"deposit_type":"instant","amount":${amount}.00}`;

    const user = JSON.parse(localStorage.getItem("user"));

    console.log(data);

    if (!method) {
      setLoading(false);
      return toast.error("Select a payment method.");
    }

    const res = await axios(
      config(
        "post",
        `${bambooLive}/api/deposit`,
        user.jwt,
        data
      )
    );

    // console.log(res.data.deposit_link);

    router.push(res.data.deposit_link);

    setLoading(false);
  };

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
                className={`${
                  stepTwo ? `w-1/2` : `w-1/4`
                }  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                {stepOne && (
                  <form onSubmit={submitStepOne} className="space-y-12">
                    <div className="space-y-4 bg-white ">
                      <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                        <h3
                          className="text-lg font-bold capitalize leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Amount
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
                              <div className="col-span-6 space-y-3">
                                <CurrencyInput
                                  name="amount"
                                  // defaultValue={amount}
                                  placeholder="$"
                                  decimalsLimit={2}
                                  onValueChange={(value, name) =>
                                    setAmount(value)
                                  }
                                  required
                                  className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid">
                        <button
                          type="submit"
                          disabled={loading ? true : false}
                          className="btn flex w-36 justify-between place-self-end border-none bg-green-600 hover:bg-green-700 capitalize"
                        >
                          {loading ? <Spin /> : <div>Next</div>}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {stepTwo && (
                  <>
                    <div className="space-y-12">
                      <div className="space-y-4 bg-white ">
                        <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                          <h3
                            className="text-lg font-bold capitalize leading-6 text-gray-900"
                            id="modal-title"
                          >
                            Select Payment Method
                          </h3>
                          <svg
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
                          <div className="overflow-hidden">
                            <div className="">
                              <div className="grid grid-cols-2 gap-6">
                                {methods.length > 0 ? (
                                  methods.map((m) => (
                                    <div
                                      key={m?.id}
                                      onClick={() => setPaymentMethod(m?.id)}
                                      className={`${
                                        method === m?.id
                                          ? `border-2 border-green-500`
                                          : `border`
                                      } border-2 cursor-pointer hover:opacity-70 rounded-md p-5 space-y-2`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm font-bold">
                                          {m?.name}
                                        </div>
                                        <div>
                                          <img
                                            className="w-6"
                                            src={m?.logo}
                                            alt={m?.name}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex space-x-12 grid-cols-4">
                                        <div>
                                          <div className="text-[8px] uppercase tracking-widest">
                                            amount
                                          </div>
                                          <div className="text-sm font-medium">
                                            {`${m?.currency_symbol}${m?.amount}`}
                                          </div>
                                        </div>

                                        <div>
                                          <div className="text-[8px] uppercase tracking-widest">
                                            P. Fee
                                          </div>
                                          <div className="text-sm font-medium">
                                            {`${m?.currency_symbol}${m?.processing_fee}`}
                                          </div>
                                        </div>

                                        {/* <div>
                                          <div className="text-[8px] uppercase tracking-widest">
                                            DM. Fee
                                          </div>
                                          <div className="text-sm font-medium">
                                            {`${m?.currency_symbol}${m?.deposit_method_fee}`}
                                          </div>
                                        </div> */}

                                        {m.exchange_rate && (
                                          <div>
                                            <div className="text-[8px] uppercase tracking-widest">
                                              rate
                                            </div>
                                            <div className="text-sm font-medium">
                                              {`${m?.exchange_rate}`}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div>Loading...</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setStep(1)}
                            type="submit"
                            className="btn flex w-36 justify-between place-self-end border-none bg-gray-500 capitalize hover:bg-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 -rotate-180"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>

                            <div>Back</div>
                          </button>

                          <button
                            onClick={() => generatePaymentLink()}
                            type="submit"
                            disabled={loading ? true : false}
                            className="btn flex w-36 justify-between border-none bg-green-600 hover:bg-green-700 capitalize"
                          >
                            {loading ? <Spin /> : <div>Next</div>}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

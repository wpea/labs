import axios from "axios";
import React, { useRef, useState, Fragment } from "react";
import { useParams, useRouter } from "next/router";
import { ASSETMANAGERS } from "../../lib/api";
import { Dialog, Transition } from "@headlessui/react";

export default function CreateRolloverButton() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const router = useRouter();
  const { transaction } = router.query;

  const [formData, setFormData] = useState({
    rate: "",
    days: "",
  });

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${ASSETMANAGERS}/rollover/create/${transaction}`,
        // `http://localhost:5001/rollover/create/${transaction}`,
        {
          rate: formData.rate,
          days: formData.days,
          transactoinId: transaction,
        }
      );

      closeModal();
      router.reload();
    } catch (error) {
      console.log("error submiting form,", error);
    }
  };

  //   const createReminder = async (formData) => {
  //     try {
  //       const response = await axios.post(
  //         "https://client.wealthparadigm.org/api/reminder",
  //         {
  //           reminder: formData.description,
  //           years: 1,
  //           freq: 6,
  //           init_date: formData.date,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${JSON.parse(
  //               localStorage.getItem("token")
  //             )}`,
  //           },
  //         }
  //       );
  //
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <button
        color={"#2D7EC2"}
        className=" items-end  inline-flex justify-center rounded-md border border-transparent bg-[#2D7EC2] px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onClick={openModal}
        type="submit"
      >
        Create Rollover
      </button>

      <div className=" mb-2 flex mx-auto items-center">
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add a Rollover
                    </Dialog.Title>

                    <form className="flex flex-col gap-4">
                      <div>
                        <div className="mb-2 block">
                          <label htmlFor="email1" value="Rate ">
                            Rate
                          </label>
                        </div>
                        <input
                          id="rate"
                          name="rate"
                          onChange={handleChange}
                          value={formData.rate}
                          placeholder="rate"
                          required
                          type="number"
                          onFocus={(e) => e.stopPropagation()}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <label htmlFor="email1" value="Rate ">
                            Rollover Duration
                          </label>
                        </div>
                        <input
                          id="day"
                          name="days"
                          onChange={handleChange}
                          value={formData.days}
                          placeholder="Rollover Duration"
                          required
                          type="number" //give it a min&max
                          onFocus={(e) => e.stopPropagation()}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>

                      {/* <div>
                        <div className="mb-2 block">
                          <label
                            htmlFor="InvestmentDate"
                            value="InvestmentDate"
                          >
                            Investment Date
                          </label>
                        </div>
                        <input
                          id="Investment Date"
                          required
                          type="date"
                          onChange={handleChange}
                          onClick={(e) => e.stopPropagation()}
                          value={formData.date}
                          name="date"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <label htmlFor="MaturityDate" value="MaturityDate">
                            Maturity Date
                          </label>
                        </div>
                        <input
                          id="MaturityDate"
                          required
                          type="date"
                          onChange={handleChange}
                          value={formData.maturityDate}
                          onClick={(e) => e.stopPropagation()}
                          name="maturityDate"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div> */}
                    </form>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#2D7EC2] px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={submitForm}
                      >
                        Submit
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

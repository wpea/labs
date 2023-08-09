import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import React, { useRef, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { ASSETMANAGERS } from "../../lib/api";

export default function Buttons() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const router = useRouter();
  const { fundmanagerId } = router.query;

  // const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    // rate: "",
    // date: "",
    // maturityDate: "",
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("submiting");
    try {
      console.log(formData);
      const response = await axios.post(
        `${ASSETMANAGERS}/transactions/${fundmanagerId}`,
        {
          amount: formData.amount,
          // rate: formData.rate,
          // date: formData.date,
          // maturityDate: formData.maturityDate,
          description: formData.description,
          fundManagers: fundmanagerId,
        }
      );
      createReminder(formData);
      console.log(response.data);
      onClose();
      closeModal();
      router.reload();
    } catch (error) {
      console.log("error submiting form,", error);
    }
  };

  const createReminder = async (formData) => {
    try {
      const response = await axios.post(
        "https://client.wealthparadigm.org/api/reminder",
        {
          reminder: formData.description,
          years: 1,
          freq: 6,
          init_date: formData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
        className="flex items-end bg-[#2D7EC2] text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center0"
        onClick={openModal}
        type="submit"
      >
        Add Transaction
      </button>

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
                    className="text-lg font-medium leading-6 text-gray-900 mb-3"
                  >
                    Add New Transaction
                  </Dialog.Title>

                  <form className="flex flex-col gap-4">
                    <div>
                      <div className="mb-2 block">
                        <label htmlFor="amount" value="Amount ">
                          Amount
                        </label>
                      </div>
                      <input
                        id="amount"
                        name="amount"
                        onChange={handleChange}
                        value={formData.amount}
                        placeholder="Amount"
                        required
                        type="number"
                        onFocus={(e) => e.stopPropagation()}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <label htmlFor="description" value="Description">
                          Description
                        </label>
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        required
                        type="text"
                        onChange={handleChange}
                        onFocus={(e) => e.stopPropagation()}
                        value={formData.description}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      />
                    </div>

                    {/* <Button
                color={"#2D7EC2"}
                className="text-white bg-[#2D7EC2]"
                type="submit"
                onClick={submitForm}
              >
                Submit
              </Button> */}
                  </form>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#2D7EC2] px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
    </>
  );
}

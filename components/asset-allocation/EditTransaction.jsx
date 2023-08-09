"use client";

import axios from "axios";
import React, { useRef, useState, useEffect, Fragment } from "react";
import { ASSETMANAGERS } from "../../lib/api";

import { Dialog, Transition } from "@headlessui/react";
// @ts-ignore
// import { useParams, useRouter } from "next/navigation";

export default function EditButton({ transactionId, previousInfo }) {
  //   const params = useParams();
  //   const router = useRouter();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  // const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    rate: "",
    date: "",
    description: "",
    maturityDate: "",
  });
  const [previousFormData, setpreviousFormData] = useState({
    amount: previousInfo.amount,
    rate: previousInfo.rate,
    date: new Date(previousInfo.date).toLocaleDateString(),
    description: previousInfo.description,
    maturityDate: previousInfo.maturityDate,
  });
  const rootRef = useRef(null);

  const onClick = () => {
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(!true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("submiting");
    try {
      console.log(formData);
      const response = await axios.put(
        `${ASSETMANAGERS}/transactions/${transactionId}`,
        {
          amount: formData.amount,
          rate: formData.rate,
          date: formData.date,
          description: formData.description,
          maturityDate: formData.maturityDate,
          fundManagers: params.id,
        }
      );
      console.log(response.data);
      onClose();
      router.refresh();
    } catch (error) {
      console.log("error submiting form,", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [show, setShow] = useState(false);
  const handleChanges = (selectedDate) => {
    console.log(selectedDate);
  };
  const handleClose = (state) => {
    setShow(state);
  };

  //   useEffect(() => {
  //     const getTransactionDetails = async (transactionId) => {
  //       console.log(formData);
  //       console.log("submiting");
  //       try {
  //         console.log(formData);
  //         const response = await axios.get(
  //           `http://localhost:5001/transactions/${transactionId}`
  //         );
  //         console.log(response.data);
  //         setFormData({
  //           rate: response.data.rate,
  //           date: response.data.date,
  //           description: response.data.description,
  //           maturityDate: response.data.maturityDate,
  //         });
  //       } catch (error) {
  //         console.log("error fectching transaction details,", error);
  //       }
  //     };
  //     getTransactionDetails(transactionId);
  //   }, [transactionId]);

  return (
    <>
      <button
        className="flex items-end text-xs px-0  font-medium text-[#2D7EC2] bg-transparent hover:bg-transparent hover:underline"
        onClick={onClick}
        type="submit"
      >
        Edit
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
                      className="text-lg font-medium leading-6 text-gray-900 mb-2"
                    >
                      Edit Transaction
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
                          placeholder={previousFormData.amount}
                          defaultValue={previousFormData.amount}
                          required
                          type="number"
                          onFocus={(e) => e.stopPropagation()}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg "
                        />
                      </div>
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
                          placeholder={previousFormData.rate}
                          defaultValue={previousFormData.rate}
                          required
                          type="number"
                          onFocus={(e) => e.stopPropagation()}
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
                          defaultValue={previousFormData.description}
                          placeholder={previousFormData.description}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <label
                            htmlFor="InvestmentDate"
                            value="InvestmentDate"
                          >
                            InvestmentDate
                          </label>
                        </div>
                        <input
                          id="Investment Date"
                          required={true}
                          type="date"
                          onChange={handleChange}
                          onClick={(e) => e.stopPropagation()}
                          defaultValue={previousFormData.date}
                          name="date"
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <label htmlFor="MaturityDate" value="MaturityDate" />
                        </div>
                        <input
                          id="MaturityDate"
                          required
                          type="date"
                          onChange={handleChange}
                          defaultValue={previousFormData.maturityDate}
                          onClick={(e) => e.stopPropagation()}
                          name="maturityDate"
                        />
                      </div>
                      <button
                        color={"#2D7EC2"}
                        className="text-white bg-[#2D7EC2]"
                        type="submit"
                        onClick={submitForm}
                      >
                        Submit
                      </button>
                    </form>{" "}
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

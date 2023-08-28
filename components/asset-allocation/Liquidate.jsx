"use client";

import axios from "axios";
import React, { useRef, useState, useEffect, Fragment } from "react";
import { ASSETMANAGERS } from "../../lib/api";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
const localhost = "http://localhost:5001";

import { Dialog, Transition } from "@headlessui/react";

export default function LiquidateButton({ transactionId, previousInfo }) {
  const router = useRouter();
  let [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const [formData, setFormData] = useState({
    amount: "",
    date: "",
  });
  const [previousFormData, setpreviousFormData] = useState({
    amount: previousInfo.amount,
    rate: previousInfo.rate,
    date: new Date(previousInfo.date).toLocaleDateString(),
    description: previousInfo.description,
    maturityDate: previousInfo.maturityDate,
  });

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("submiting");
    try {
      console.log(formData);
      const response = await axios.post(
        `${localhost}/transactions/${transactionId}/liquidate`,
        {
          liquidationAmount: formData.amount,
          date: formData.date,
          //   fundManagers: params.id,
        }
      );
      console.log(response.data);
      closeModal();
      router.reload();
    } catch (error) {
      console.log("error submiting form,", error);
      toast(error.message, {
        style: {
          border: "1px solid red text-red-600",
          background: "red",
        },
      });
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        className="flex items-end text-xs px-0  font-medium text-red-400 bg-transparent hover:bg-transparent hover:underline"
        type="submit"
        onClick={openModal}
      >
        Liquidate
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
                      Liquidate Investment
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
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <label
                            htmlFor="InvestmentDate"
                            value="InvestmentDate"
                          >
                            Date
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
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                        />
                      </div>

                      {error && (
                        <div className="mt-2 text-xs text-red-600">{error}</div>
                      )}

                      <button
                        className="text-white w-1/4 bg-[#2D7EC2] items-end  inline-flex justify-center rounded-md border border-transparent bg-[#2D7EC2] px-4 py-2 text-sm font-medium text-white"
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

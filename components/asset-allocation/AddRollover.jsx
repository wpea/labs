import axios from "axios";
import { Button, Label, TextInput, Textarea, Modal } from "flowbite-react";
import React, { useRef, useState, Fragment } from "react";
import { useParams, useRouter } from "next/router";
import { ASSETMANAGERS } from "../../lib/api";
import { Dialog, Transition } from '@headlessui/react'

export default function CreateRolloverButton() {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  const router = useRouter();
  const { transaction } = router.query;
  

  
  const [formData, setFormData] = useState({
    amount: "",
    rate: "",
    date: "",
    description: "",
    maturityDate: "",
  });
  

  

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("submiting");

    try {
      const response = await axios.post(
        `${ASSETMANAGERS}/rollover/create/${transaction}`,
        {
          rate: formData.rate,
          date: formData.date,
          maturityDate: formData.maturityDate,
          transactoinId: transaction,
        }
      );
      
      console.log(response.data);
      closeModal()
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
  //       console.log(response);
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
      <Button
        color={"#2D7EC2"}
        className="flex items-end bg-[#2D7EC2] text-white"
        onClick={openModal}
        type="submit"
      >
        Create Rollover
      </Button>

      <div className=" mb-2 flex mx-auto items-center" >
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
                  <Label htmlFor="email1" value="Rate " />
                </div>
                <TextInput
                  id="rate"
                  name="rate"
                  onChange={handleChange}
                  value={formData.rate}
                  placeholder="rate"
                  required
                  type="number"
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="InvestmentDate" value="InvestmentDate" />
                </div>
                <TextInput
                  id="Investment Date"
                  required
                  type="date"
                  onChange={handleChange}
                  onClick={(e) => e.stopPropagation()}
                  value={formData.date}
                  name="date"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="MaturityDate" value="MaturityDate" />
                </div>
                <TextInput
                  id="MaturityDate"
                  required
                  type="date"
                  onChange={handleChange}
                  value={formData.maturityDate}
                  onClick={(e) => e.stopPropagation()}
                  name="maturityDate"
                />
              </div>
  
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

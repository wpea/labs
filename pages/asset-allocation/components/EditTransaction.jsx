"use client";

import axios from "axios";
import { Button, Label, TextInput, Textarea, Modal } from "flowbite-react";
import React, { useRef, useState, useEffect } from "react";
// @ts-ignore
// import { useParams, useRouter } from "next/navigation";

export default function EditButton({ transactionId, previousInfo }) {
  //   const params = useParams();
  //   const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
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
        `http://localhost:5001/transactions/${transactionId}`,
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
  const clickMe = () => {
    console.log("clcicked me");
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
      <Button
        // color={"#2D7EC2"}
        size={"small"}
        className="flex items-end text-xs px-0  font-medium text-[#2D7EC2] bg-transparent hover:bg-transparent hover:underline"
        onClick={onClick}
        type="submit"
      >
        Edit
      </Button>

      <div className=" mb-2 flex mx-auto items-center" ref={rootRef}>
        <Modal
          onClose={onClose}
          show={openModal}
          dismissible
          root={rootRef.current ?? undefined}
        >
          <Modal.Header>Edit Transaction</Modal.Header>
          <Modal.Body>
            <form className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="amount" value="Amount " />
                </div>
                <TextInput
                  id="amount"
                  name="amount"
                  onChange={handleChange}
                  placeholder={previousFormData.amount}
                  defaultValue={previousFormData.amount}
                  required
                  type="number"
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email1" value="Rate " />
                </div>
                <TextInput
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
                  <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
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
                  <Label htmlFor="InvestmentDate" value="InvestmentDate" />
                </div>
                <TextInput
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
                  <Label htmlFor="MaturityDate" value="MaturityDate" />
                </div>
                <TextInput
                  id="MaturityDate"
                  required
                  type="date"
                  onChange={handleChange}
                  defaultValue={previousFormData.maturityDate}
                  onClick={(e) => e.stopPropagation()}
                  name="maturityDate"
                />
              </div>
              <Button
                color={"#2D7EC2"}
                className="text-white bg-[#2D7EC2]"
                type="submit"
                onClick={submitForm}
              >
                Submit
              </Button>
            </form>{" "}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

import axios from "axios";
import { Button, Label, TextInput, Textarea, Modal } from "flowbite-react";
import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Buttons() {
  const router = useRouter();
  const { fundmanagerId } = router.query;

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    rate: "",
    date: "",
    description: "",
    maturityDate: "",
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
    console.log("submiting");
    try {
      console.log(formData);
      const response = await axios.post(
        `http://localhost:5001/transactions/${fundmanagerId}`,
        {
          amount: formData.amount,
          rate: formData.rate,
          date: formData.date,
          description: formData.description,
          maturityDate: formData.maturityDate,
          fundManagers: fundmanagerId,
        }
      );
      console.log(response.data);
      onClose();
      router.reload();
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

  return (
    <>
      <Button
        color={"#2D7EC2"}
        className="flex items-end bg-[#2D7EC2] text-white"
        onClick={onClick}
        type="submit"
      >
        Add Transaction
      </Button>

      <div className=" mb-2 flex mx-auto items-center" ref={rootRef}>
        <Modal
          onClose={onClose}
          show={openModal}
          dismissible
          root={rootRef.current ?? undefined}
        >
          <Modal.Header>Add New Transaction</Modal.Header>
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
                  value={formData.amount}
                  placeholder="Amount"
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
                  value={formData.rate}
                  placeholder="rate"
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
                  value={formData.description}
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

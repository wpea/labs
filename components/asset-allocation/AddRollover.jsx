import axios from "axios";
import { Button, Label, TextInput, Textarea, Modal } from "flowbite-react";
import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/router";

export default function CreateRolloverButton() {
  //   const params = useParams();
  const router = useRouter();
  const { transaction } = router.query;
  console.log(router.query);

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
    console.log(formData);
    console.log("submiting");

    try {
      const response = await axios.post(
        `http://localhost:5001/rollover/create/${transaction}`,
        {
          rate: formData.rate,
          date: formData.date,
          maturityDate: formData.maturityDate,
          transactoinId: transaction,
        }
      );
      //   createReminder(formData);
      console.log(response.data);
      onClose();
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
        Create Rollover
      </Button>

      <div className=" mb-2 flex mx-auto items-center" ref={rootRef}>
        <Modal
          onClose={onClose}
          show={openModal}
          dismissible
          root={rootRef.current ?? undefined}
        >
          <Modal.Header>Add a Rollover</Modal.Header>
          <Modal.Body>
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

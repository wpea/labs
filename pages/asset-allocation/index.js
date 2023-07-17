import { useRouter } from "next/router";
import Header from "../../components/header";
import { Button, Label, TextInput, Textarea, Modal } from "flowbite-react";
import axios from "axios";

import Card from "../../components/asset-allocation/Card";
import Overview from "../../components/asset-allocation/Overview";
import { useEffect, useRef, useState } from "react";

import { ASSETMANAGERS } from "../../lib/api";

const AssetAllocation = () => {
  const [assetManagers, setAssetManagers] = useState([]);
  const [totalCap, setTotalCap] = useState("");
  const [topFive, setTopFive] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const rootRef = useRef(null);

  const [formData, setFormData] = useState({
    rate: "",
    date: "",
    description: "",
    maturityDate: "",
    link: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("submiting");
    try {
      const response = await axios.post(
        `${ASSETMANAGERS}/fundmanager`,
        formData
      );
      console.log(response.data);
      onClose();
      router.refresh();
    } catch (error) {
      console.log("error submiting form,");
      console.log(error);
    }
  };

  const onClick = () => {
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(!true);
  };
  useEffect(() => {
    const fetchTop5 = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${ASSETMANAGERS}/total-cap/total/alloc-size`
        );
        console.log(response);
        setTopFive(response.data);
        setLoading(false);
      } catch (error) {
        console.log("not working:", error);
      }
    };

    const fetchTotalCap = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ASSETMANAGERS}/total-cap`);
        setTotalCap(response.data.totalRate);
        setLoading(false);
      } catch (error) {}
    };

    const fetchFundManagers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ASSETMANAGERS}/fundManager`);

        // console.log(response);
        setAssetManagers(response.data);
        // console.log(assetManagers);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTop5();
    fetchTotalCap();
    fetchFundManagers();
  }, []);
  return (
    <>
      <div className="w-full grid">
        <div className="md:px-20 p-10 space-y-10 grid">
          <Header />
          <div className="h-screen  ">
            <Overview
              topFive={topFive}
              totalCap={totalCap}
              totalAssetManagers={assetManagers.count}
            />

            {/* Modal */}
            <div className=" mb-2 flex mx-auto items-center" ref={rootRef}>
              <Modal
                onClose={onClose}
                show={openModal}
                dismissible
                root={rootRef.current ?? undefined}
              >
                <Modal.Header>Add New Fund Manager</Modal.Header>
                <Modal.Body>
                  <div className="space-y-6"></div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value="Name" />
                    </div>
                    <TextInput
                      id="name"
                      name="name"
                      placeholder="Name of Asset Manager"
                      required
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>
                  <div>
                    <div className=" items-center justify-center w-full mb-2">
                      <Label htmlFor="Image" value="Image" className="mb-2" />
                      <Label
                        for="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          name="image"
                          className="hidden"
                          onChange={handleChange}
                          value={formData.image}
                        />
                      </Label>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value="Google Drive Link" />
                    </div>
                    <TextInput
                      id="link"
                      name="link"
                      placeholder="Link to Investment Certificates"
                      required
                      onChange={handleChange}
                      value={formData.link}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="Description" value="Description" />
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      type=""
                      placeholder="Brief description of the Asset Manager"
                      onChange={handleChange}
                      value={formData.email}
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="bg-[#2D7EC2]" onClick={submitForm}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>

            <div className="pt-28 mb-12 flex justify-between">
              <h1 className=" font-bold text-2xl rounded-md   ">
                Fund Managers
              </h1>
              <div className="flex items-center flex-col gap-8">
                <Button
                  color="#2D7EC2"
                  className="flex items-end bg-[#2D7EC2] text-white"
                  onClick={onClick}
                >
                  Add Asset Manager
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-4 gap-12   m-auto">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="animate-pulse bg-slate-200 w-72 h-52 rounded m-3 overflow-hidden border  cursor-pointer "
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-12   m-auto">
                {assetManagers?.data?.map((assetManager) => {
                  return (
                    <Card
                      key={assetManager._id}
                      src={assetManager.image}
                      href={assetManager._id}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetAllocation;

import { useRouter } from "next/router";
import Header from "../../components/header";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

import Card from "../../components/asset-allocation/Card";
import Overview from "../../components/asset-allocation/Overview";
import { useEffect, useRef, useState, Fragment } from "react";

import { ASSETMANAGERS } from "../../lib/api";

const AssetAllocation = () => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [assetManagers, setAssetManagers] = useState([]);
  const [totalCap, setTotalCap] = useState("");
  const [topFive, setTopFive] = useState([]);
  // const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null); // state variable to hold the selected image file
  const [cloudinaryUrl, setCloudinaryUrl] = useState(""); //state variable to hold the Cloudinary URL

  const router = useRouter();

  const [formData, setFormData] = useState({
    rate: "",
    date: "",
    description: "",
    maturityDate: "",
    link: "",
  });

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    handleImageUpload(file); // Call the handleImageUpload function with the selected file
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset name
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data.secure_url);
      setCloudinaryUrl(data.secure_url); // Store the Cloudinary URL in the state variable
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

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
    // Update the form data with the Cloudinary URL
    const updatedFormData = {
      ...formData,
      image: cloudinaryUrl,
    };
    try {
      const response = await axios.post(
        `${ASSETMANAGERS}/fundmanager`,
        updatedFormData
      );
      console.log(response.data);
      closeModal();
      router.reload();
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
        const response = await axios.get(`${ASSETMANAGERS}/fundmanager`);

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
      <div className="w-full grid mb-20">
        <div className="md:px-20 p-10 space-y-10 grid">
          <Header />
          <div>
            <Overview
              topFive={topFive}
              totalCap={totalCap}
              totalAssetManagers={assetManagers.count}
            />

            {/* Modal */}
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
                          Add New Fund Manager
                        </Dialog.Title>

                        <div className="space-y-6"></div>
                        {/* <div>
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
                        </div> */}

                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                          >
                            Name
                          </label>
                          <input
                            className="shadow appearance-none  py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="username"
                            type="text"
                            placeholder="Name of Asset Manager"
                            onChange={handleChange}
                            value={formData.name}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                          >
                            Google Drive Link
                          </label>
                          <input
                            className="shadow appearance-none  py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
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
                            <label htmlFor="Description" value="Description">
                              Description
                            </label>
                          </div>
                          <textarea
                            id="description"
                            name="description"
                            required
                            type=""
                            placeholder="Brief description of the Asset Manager"
                            onChange={handleChange}
                            value={formData.description}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>

                        <div className="mt-4">
                          <button
                            className="bg-[#2D7EC2] text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center0"
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

            <div className="pt-28 mb-12 flex justify-between">
              <h1 className="font-bold text-xl rounded-md">
                Fund Managers
              </h1>
              <div className="flex items-center flex-col gap-8">
                <button
                  color="#2D7EC2"
                  className="flex items-end bg-[#2D7EC2]  text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center0"
                  onClick={openModal}
                >
                  Add Asset Manager
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-4 gap-12 m-auto">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="animate-pulse bg-slate-100 opacity-60 h-20 rounded m-3 overflow-hidden cursor-pointer"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-12 m-auto">
                {assetManagers?.data?.map((assetManager) => {
                  return (
                    <Card
                      key={assetManager._id}
                      src={assetManager.image}
                      href={assetManager._id}
                      name={assetManager.name}
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

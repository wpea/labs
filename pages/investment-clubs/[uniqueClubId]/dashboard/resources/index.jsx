/* eslint-disable react/jsx-no-target-blank */
import React, { useState, Fragment, useEffect } from "react";

import { Transition, Dialog } from "@headlessui/react";

// import { getToken } from "../../../../lib/hooks/useAuth2";
import toast from "react-hot-toast";
import axios from "axios";
import DashboardLayout from "../../../../../components/investment-club/DashboardLayout";
import { getToken } from "../../../../../lib/hooks/useAuth2";
import { useRouter } from "next/router";

function formatDateTime(dateTimeStr) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Split the date and time parts
  const [datePart, timePart] = dateTimeStr.split(" ");

  // Extract day, month, and year from the date part
  const [day, month, year] = datePart.split("-").map(Number);

  // Extract hour, minute, and second from the time part
  const [hour, minute, second] = timePart.split(":").map(Number);

  // Determine AM/PM and adjust hours
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  // Construct the formatted date-time string
  const formattedDate = `${months[month - 1]} ${day}, ${year}`;
  const formattedTime = `${hour12}:${minute
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return `${formattedDate}`;
}

const Index = () => {
  const router = useRouter();
  const { uniqueClubId } = router.query;
  console.log(uniqueClubId);
  const [isOpen, setIsOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const values = {
      club_unique_id: uniqueClubId,
      title: formData.title,
      date: formData.date,
      file: formData.file,
      video_url: "https://zoom/view", //get Video url
      type: "resource",
    };
    console.log(values);
    try {
      const res = await axios.post(
        "https://client.wealthparadigm.org/api/club/resources",
        values,
        {
          headers: {
            Authorization: `Bearer 437|ar5lO1dTV1tyKRyjUTucKIB6Kioj6G6yg2oLGpSG`, //CHANEG
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      toast.success("Resource Created Successfully");

      setIsOpen(false);
      setFormData({
        title: "",
        date: "",
        file: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://client.wealthparadigm.org/api/labs/clubs/resource/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      toast.success("Resource Deleted Successfully");

      // Update state to remove deleted resource
      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete resource");
    }
  };

  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(
          `https://client.wealthparadigm.org/api/labs/clubs/resources/${uniqueClubId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res.data);
        setResources(res.data);
        // setResources((prevResources) => [...prevResources, res.data]);
        console.log(resources);
      } catch (error) {
        console.log(error);
      }
    };

    getResources();
  }, [uniqueClubId]);

  const groupResourcesByYear = (resources) => {
    return resources.reduce((groups, resource) => {
      const year = new Date(resource.created_at).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(resource);
      return groups;
    }, {});
  };

  const groupedResources = groupResourcesByYear(resources);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-[#2D2D2D] text-2xl font-semibold">Resources</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="py-2 px-3  bg-[#2D2D2D] gap-x-1 flex items-center rounded-md"
        >
          <p className="text-white">Add</p>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1V13M13 7H1"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {Object.entries(groupedResources).map(([year, resources]) => (
        <div key={year} className="items-start gap-x-14 mt-8 flex">
          <p className="text-[8px] font-semibold">{year}</p>
          <div className="flex gap-x-7">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex flex-col bg-white px-3 py-[10px] rounded-md"
              >
                <h3 className="text-xs font-semibold">{resource.title}</h3>
                <div className="flex gap-x-4">
                  <p className="text-[8px] text-[#969696]">
                    {formatDateTime(resource.created_at)}
                  </p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={resource.file}
                    className="text-[#2D7EC2] text-[8px]"
                  >
                    View
                  </a>
                  <button
                    className="text-[#FF0000] text-[8px]"
                    onClick={() => {
                      handleDelete(resource.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsOpen(!isOpen);
          }}
        >
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
                <Dialog.Panel className="max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 bg-white ">
                      <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                        <h3
                          className="text-lg font-bold  leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Add Resource
                        </h3>
                        <svg
                          onClick={() => {
                            setIsOpen(!isOpen);
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 cursor-pointer fill-current text-gray-500 hover:text-gray-800"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <div className="sm:items-start">
                        <div className="overflow-hidden sm:rounded-md">
                          <div className="bg-white">
                            <div className="grid grid-cols-6 gap-6">
                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  name="title"
                                  required
                                  value={formData.title}
                                  onChange={handleChange}
                                  className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sm:items-start">
                        <div className="overflow-hidden sm:rounded-md">
                          <div className="bg-white">
                            <div className="grid grid-cols-6 gap-6">
                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  name="date"
                                  required
                                  value={formData.date}
                                  onChange={handleChange}
                                  // placeholder="&#128197; Select Date"

                                  className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:items-start ">
                        <div className="overflow-hidden sm:rounded-md">
                          <div className="bg-white">
                            <div className="grid grid-cols-6 gap-6">
                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700  items-center">
                                  Upload Resource{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="file"
                                  name="file"
                                  required
                                  onChange={handleChange}
                                  className="mt-1 uppercase block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        type="submit"
                        className="text-white bg-[#2D2D2D]  flex items-center gap-x-2 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      >
                        Create
                        <svg
                          width="16"
                          height="13"
                          viewBox="0 0 16 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 8.5L4.5 12L15 1"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DashboardLayout>
  );
};

export default Index;

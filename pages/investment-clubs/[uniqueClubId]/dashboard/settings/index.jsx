import React, { useEffect, useState } from "react";

import { Switch } from "@headlessui/react";
import DashboardLayout from "../../../../../components/investment-club/DashboardLayout";
import { useRouter } from "next/router";
import axios from "axios";
import { getToken } from "../../../../../lib/hooks/useAuth2";

const Index = () => {
  const router = useRouter();
  const { uniqueClubId } = router.query;
  const [enabled, setEnabled] = useState(false);
  const [formData, setFormData] = useState({
    name: "Pearl Vest",
    risk_profile: "",
    unit_cap: "",
    unit_value: "",
    otr_fee: "",
  });

  const fetchClubDetails = async () => {
    try {
      const response = await axios.post(
        `https://client.wealthparadigm.org/api/labs/clubs/details/${uniqueClubId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = response.data;
      setFormData({
        name: data.name,
        risk_profile: data.risk_profile,
        unit_cap: data.unit_cap,
        unit_value: data.unit_value,
        otr_fee: data.otr_fee,
      });
    } catch (error) {
      console.error("Error fetching club details:", error);
    }
  };

  useEffect(() => {
    fetchClubDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://client.wealthparadigm.org/api/labs/clubs/details/${uniqueClubId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching club details:", error);
    }
    console.log("Form data:", formData);
  };

  return (
    <DashboardLayout>
      <h1 className="text-[#2D2D2D] text-2xl font-semibold">Settings</h1>
      <div className=" p-5 w-2/3 bg-white rounded-md my-6">
        <h1 className="text-[#2D2D2D] text-sm mb-4 font-semibold">Details</h1>
        <div className="mb-5">
          <label
            htmlFor="club-name"
            className="block mb-2 text-sm font-normal text-black "
          >
            Club Name <span className="text-xs text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            disabled
            className="bg-transparent border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="risk-profile"
            className="block mb-2 text-sm font-normal text-black "
          >
            Risk Profile
            <span className="text-xs text-red-600">*</span>
          </label>
          <select
            id="risk_profile"
            name="risk_profile"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={formData.risk_profile}
            onChange={handleChange}
          >
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Aggressive">Aggressive</option>
          </select>
        </div>
      </div>

      <div className="p-5 w-2/3 bg-white rounded-md my-6">
        <h1 className="text-[#2D2D2D] text-sm mb-4 font-semibold">Superuser</h1>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="block mb-2 text-sm font-normal text-black ">
              Turn off registration
            </h2>
            <p className="text-[#757575] text-xs">
              Disable onboarding form access for this investment club
            </p>
          </div>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
              enabled ? "bg-green-500" : "bg-red-500"
            } relative inline-flex h-7 w-14 items-center rounded-full`}
          >
            <span
              className={`${
                enabled ? "translate-x-7" : "translate-x-0"
              } inline-block h-5 w-5 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>

      <div className="flex justify-end w-2/3">
        <button
          className="py-2 px-3 mb-14 bg-[#55B246] gap-x-4 flex items-center rounded-md justify-end text-sm"
          onClick={handleSubmit}
        >
          <p className="text-white">Save Changes</p>
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
    </DashboardLayout>
  );
};

export default Index;

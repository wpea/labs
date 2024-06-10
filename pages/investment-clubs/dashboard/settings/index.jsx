import React, { useState } from "react";
import DashboardLayout from "../../../../components/investment-club/DashboardLayout";
import { Switch } from "@headlessui/react";

const Index = () => {
  const [enabled, setEnabled] = useState(false);
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
            type="email"
            id="email"
            className="bg-transparent border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="The Umm Fariha Network"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="club-name"
            className="block mb-2 text-sm font-normal text-black "
          >
            Risk Profile
            <span className="text-xs text-red-600">*</span>
          </label>
          <select
            id="risk-profile"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option>Conservative</option>
          </select>
        </div>
      </div>

      <div className=" p-5 w-2/3 bg-white rounded-md my-6">
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
            className="border group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-red-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        </div>
      </div>

      <div className="flex justify-end w-2/3">
        <button className="py-2 px-3 mb-14 bg-[#55B246] gap-x-4 flex items-center rounded-md justify-end text-sm">
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

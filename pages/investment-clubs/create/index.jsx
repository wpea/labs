import React, { useState } from "react";
import AppLayout from "../../../components/Layouts/AppLayout";
import Layout from "../../../components/investment-club/layout";
import axios from "axios";
import { getToken } from "../../../lib/hooks/useAuth2";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clubName: "",
    totalUnits: "",
    minUnitAmount: "",
    riskProfile: "Conservative", // Default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createClub = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/labs/clubs/create`,
        {
          name: formData.clubName,
          risk_profile: formData.riskProfile,
          unit_cap: formData.totalUnits,
          unit_value: formData.minUnitAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("Club created successfully:", response.data);
      // Handle success, maybe show a success message or redirect
      toast.success("Club created successfully");
      router.push("/investment-clubs");
    } catch (error) {
      console.error("Error creating club:", error);
      toast.error("Error creating club:", error);
      // Handle error, maybe show an error message
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    createClub();
  };

  return (
    <AppLayout>
      <Layout>
        <div className="h-96 w-1/3 flex flex-col">
          <button className="w-8 h-8 mb-14">
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="17.5"
                cy="17.5"
                r="16.5"
                stroke="black"
                strokeWidth="1.5"
              />
              <path
                d="M10.9 17.5L24.1 17.5M10.9 17.5C10.9 16.3446 14.1906 14.186 15.025 13.375M10.9 17.5C10.9 18.6554 14.1906 20.814 15.025 21.625"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h2>Create a new investment club</h2>

          <span className="borrder border-t-[0.5px] my-6"></span>

          <form className="w-full " onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="club-name"
                className="block mb-2 text-sm font-normal text-black "
              >
                Club Name <span className="text-xs text-red-600">*</span>
              </label>
              <input
                type="text"
                id="club-name"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className="bg-transparent border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="club-name"
                className="block mb-2 text-sm font-normal text-black "
              >
                Total number of available units
              </label>
              <input
                type="number"
                id="club-name"
                name="totalUnits"
                value={formData.totalUnits}
                onChange={handleChange}
                className="bg-transparent border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="$ 50000"
              />
              <p className="text-xs text-[#757575] mt-2">
                Leave empty if uncapped
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="club-name"
                className="block mb-2 text-sm font-normal text-black "
              >
                Minimum Unit Amount{" "}
                <span className="text-xs text-red-600">*</span>
              </label>
              <input
                type="number"
                id="minUnitAmount"
                name="minUnitAmount"
                value={formData.minUnitAmount}
                onChange={handleChange}
                className="bg-transparent border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="$ 50000"
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
                name="riskProfile"
                value={formData.riskProfile}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="Conservative">Conservative</option>
                <option value="Moderate">Moderate</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>

            <button
              onClick={createClub}
              type="submit"
              className="text-white bg-[#2D2D2D]  flex items-center gap-x-2 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Complete
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
          </form>
        </div>
      </Layout>
    </AppLayout>
  );
};

export default Index;

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../lib/contexts/globalState";

// Registration details stay in memory until step four submits them once.
export default function StepOne({ close }) {
  const [sharedState, updateSharedState] = useAppContext();
  const [data, setData] = useState({
    surname: "",
    residence_country_code: "NGA",
    phone_number: "",
    name: "",
    gender: "Man",
    email: "",
    date_of_birth: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "NGA",
    citizenship: "Nigerian",
  });

  useEffect(() => {
    //set data
    Object.keys(sharedState.reg.step_one.info).length > 0 &&
      setData({ ...data, ...sharedState.reg.step_one.info });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSharedState({
      ...sharedState,
      reg: {
        ...sharedState.reg,
        step_one: { ...sharedState.reg.step_one, info: data },
      },
    });
    router.push(`/stocks/create/step-three`);
  };


  const router = useRouter();
  return (
    <div className="grid h-screen place-items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-4 pt-7 pb-3 w-1/3 sm:px-8"
      >
        <div className="space-y-4 bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => router.push("/stocks")}
            className="h-10 -ml-1.5 w-10 mb-10 hover:opacity-60 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={0.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
            />
          </svg>

          <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
            <h3
              className="w-72 text-2xl font-bold leading-7 text-gray-900"
              id="modal-title"
            >
              Create a new stock trading account
            </h3>
          </div>

          <div className="flex items-center justify-between space-x-1">
            <div className="flex space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#2D7EC2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </div>

            <div className="text-2xs font-bold text-gray-600">Step 1 of 4</div>
          </div>

          {/* <div className="text-2xs">{JSON.stringify(data, null, 2)} </div> */}
          <div className="sm:items-start">
            <div className="overflow-hidden sm:rounded-md">
              <div className="bg-white">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.surname}
                        name="surname"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Surname"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.name}
                        name="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Firstname"
                      />
                    </div>

                    {/* <div className="space-y-1.5">
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        value={data.residence_country_code}
                        name="residence_country_code"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Residence Country code"
                      />
                      <div className="text-2xs uppercase">nga, uk, us</div>
                    </div> */}

                    {/* <div className="space-y-1.5">
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        value={data.country_code}
                        name="country_code"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Country code"
                      />
                      <div className="text-2xs uppercase">nga, uk, us</div>
                    </div> */}

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.phone_number}
                        name="phone_number"
                        required
                        pattern="^\+[1-9][0-9]{7,14}$"
                        title="International format, e.g. +2348012345678"
                        className="py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Phone number (+234…)"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.city}
                        name="city"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="City"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <select
                        onChange={handleChange}
                        value={data.gender}
                        name="gender"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                      >
                        <option disabled>Gender</option>
                        <option value="Man">Male</option>
                        <option value="Woman">Female</option>
                        {/* <option value="Other">Other</option> */}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="email"
                        onChange={handleChange}
                        value={data.email}
                        name="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Email"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <input
                        onChange={handleChange}
                        value={data.date_of_birth}
                        name="date_of_birth"
                        type="date"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.province}
                        name="province"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="State"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.postal_code}
                        name="postal_code"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Postal code"
                      />
                    </div>

                    {/* <div className="space-y-1.5">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.citizenship}
                        name="citizenship"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Citizenship"
                      />
                      <div className="text-2xs">Nigeria</div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid pb-4">
          <button
            type="submit"
            className="btn flex w-36 justify-between place-self-end border-none bg-[#2D7EC2] capitalize hover:bg-[#27669B]"
          >
            <div>Next</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

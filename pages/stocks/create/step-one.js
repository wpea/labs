import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../../lib/contexts/globalState";
import Spin from "./../../../components/Misc/Spin";
import { toast } from "react-hot-toast";
import { apiAddress, b_header_one } from "../../../lib/api";

export default function StepOne({ close }) {
  const [sharedState, updateSharedState] = useAppContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    surname: "",
    residence_country_code: "",
    phone_number: "",
    password: "",
    name: "",
    gender: "",
    email: "",
    date_of_birth: "",
    country_code: "",
    citizenship: "",
  });

  useEffect(() => {
    //set data
    Object.keys(sharedState.reg.step_one.res).length > 0 &&
      setData(sharedState.reg.step_one.info);

    checkToken();
  }, []);

  const checkToken = async () => {
    const res = await axios.get(`${apiAddress}/access/token`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    console.log(res.data.admin);

    localStorage.setItem("x-client-token", res.data.admin);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(sharedState.reg.step_one.res).length > 0)
      return router.push("/stocks/create/step-two");

    setLoading(true);

    const res = await fetch(
      "https://powered-by-bamboo-sandbox.investbamboo.com/api/register",
      {
        method: "POST", // or 'PUT'
        /**
         * find a way to generate and pass in the x-client-token on create new user account
         * */
        headers: b_header_one(localStorage.getItem("x-client-token")),
        body: JSON.stringify(data),
      }
    );

    if (res.status === 401) {
      setLoading(false);
      // invalid client token
      const text = await res.text();
      return toast.error(text);
    }

    const rdata = await res.json();

    // validation errors
    if (res.status === 422) {
      setLoading(false);
      return toast.error(rdata.message ?? "An error occured. Check your data.");
    }

    if (res.status === 200) {
      updateSharedState({
        ...sharedState,
        reg: {
          ...sharedState.reg,
          step_one: { ...sharedState.reg.step_one, res: rdata, info: data },
        },
      });

      router.push(`/stocks/create/step-two`);
    }

    // console.log(data);

    // setLoading(false);
    // .then((response) => response.json())
    // .then((rdata) => {
    //   console.log(rdata);

    //   if (rdata.errors) {
    //     setLoading(false);
    //     toast.error(rdata.message ?? "An error occured. Check your data.");
    //   } else {
    //     updateSharedState({
    //       ...sharedState,
    //       reg: { ...sharedState.reg, step_one: { ...sharedState.reg.step_one, res: rdata, info: data} },
    //     });
    //     router.push(`/stocks/create/step-two`);
    //   }
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    //   setLoading(false);
    // });
  };

  const [hide, setHide] = useState(false);

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

                    <div className="space-y-1.5">
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
                    </div>

                    <div className="space-y-1.5">
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
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={data.phone_number}
                        name="phone_number"
                        required
                        className="py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Phone number"
                      />
                    </div>

                    <div className="rounded-md border rounded-md border-gray-300 focus:border-gray-500 flex items-center">
                      <input
                        type={`${hide ? `text` : `password`}`}
                        onChange={handleChange}
                        value={data.password}
                        name="password"
                        required
                        className="block w-full border-none rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        placeholder="Password"
                      />

                      <div className="flex items-center pr-2">
                        {hide ? (
                          <svg
                            onClick={() => setHide(!hide)}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        ) : (
                          <svg
                            onClick={() => setHide(!hide)}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        )}
                      </div>
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid pb-4">
          <button
            type="submit"
            disabled={loading ? true : false}
            className="btn flex w-36 justify-between place-self-end border-none bg-[#2D7EC2] capitalize hover:bg-[#27669B]"
          >
            {loading ? <Spin /> : <div>Next</div>}
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

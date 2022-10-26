import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../lib/contexts/globalState";
import {
  apiAddress,
  bambooLive,
  b_header,
  b_header_two,
} from "../../../lib/api";
import Spin from "../../../components/Misc/Spin";
import axios from "axios";

export default function StepFour() {
  const router = useRouter();
  const notify = () => toast.success("Registration complete.");

  const [sharedState, updateSharedState] = useAppContext();
  const [loading, setLoading] = useState(false);
  const [dictionary, setDictionary] = useState({});
  const [data, setData] = useState({
    employment_status: "",
    martial_status: "",
    dependents: "",
    goal: "",
    experience: "",
    risk_tolerance: "",
    liquid: "",
    net_worth: "",
    yearly_income: "",
  });

  const storeUserData = async () => {
    // var FormData = require("form-data");
    // var sData = new FormData();
    // sData.append(
    //   "surname",
    //   JSON.stringify(sharedState.reg.step_one.info.surname)
    // );
    // sData.append(
    //   "firstname",
    //   JSON.stringify(sharedState.reg.step_one.info.name)
    // );
    // sData.append(
    //   "phone",
    //   JSON.stringify(sharedState.reg.step_one.info.phone_number)
    // );
    // sData.append(
    //   "password",
    //   JSON.stringify(sharedState.reg.step_one.info.password)
    // );
    // sData.append("email", JSON.stringify(sharedState.reg.step_one.info.email));

    var config = {
      method: "post",
      url: `${apiAddress}/stocks/account/create`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: {
        surname: sharedState.reg.step_one.info.surname,
        firstname: sharedState.reg.step_one.info.name,
        phone: sharedState.reg.step_one.info.phone_number,
        password: sharedState.reg.step_one.info.password,
        email: sharedState.reg.step_one.info.email,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data.message);
        toast.success(response.data.message);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      });

    // const res = await fetch(`${apiAddress}/stocks/account/create`, {
    //   body: JSON.stringify({
    //     surname: sharedState.reg.step_one.info.surname,
    //     firstname: sharedState.reg.step_one.info.name,
    //     phone: sharedState.reg.step_one.info.phone_number,
    //     password: sharedState.reg.step_one.info.password,
    //     email: sharedState.reg.step_one.info.email,
    //   }),
    //   headers: {
    //     Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    //     Accept: `application/json`,
    //   },
    //   method: "POST",
    // });
  };

  useEffect(() => {
    // set data
    Object.keys(sharedState.reg.step_four).length > 0 &&
      setData(sharedState.reg.step_four);

    // get dictionary
    getProfileDictionary();
  }, []);

  const getProfileDictionary = async () => {
    fetch(`${bambooLive}/api/dictionary`, {
      method: "GET",
      headers: b_header,
    })
      .then((response) => response.json())
      .then((rdata) => {
        // console.log(rdata);
        setDictionary(rdata);
      })
      .catch((error) => {
        // console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  /**
   *
   *
   *
   * COMPLETE
   * ACCOUNT
   * REGISTRATION
   *
   *
   *
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(sharedState.reg.step_one.res).length < 0)
      return router.push("/stocks/create/step-one");

    setLoading(true);

    updateSharedState({
      ...sharedState,
      reg: {
        ...sharedState.reg,
        step_four: data,
      },
    });

    console.log(localStorage.getItem("x-client-token"), sharedState);

    fetch(`${bambooLive}/api/investment_profile`, {
      method: "POST", // or 'PUT'
      headers: b_header_two(
        localStorage.getItem("x-client-token"),
        sharedState.reg.step_one.res.jwt,
        `wealth-paradigm`
      ),
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((rdata) => {
        if (rdata.errors) {
          setLoading(false);
          toast.error(rdata.message ?? "An error occured. Check your data.");
        } else {
          toast.success("Registration complete.");
          setLoading(false);
          //store data for this user
          storeUserData();
          // router.push('/stocks/dashboard');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });

    // console.log(data);

    // update the affiliation as well
    // fetch(`${bambooLive}/api/affiliations`, {
    //   method: "POST",
    //   headers: b_header_two(
    //     localStorage.getItem("x-client-token"),
    //     sharedState.reg.step_one.res.jwt,
    //     `wealth-paradigm`
    //   ),
    //   body: JSON.stringify({
    //     broker: false,
    //   }),
    // }).then((res) => console.log(res));

    /**
     *
     *
     *
     *
     *
     *
     *
     */

    var config = {
      method: "post",
      url: `${bambooLive}/api/affiliations`,
      headers: {
        authorization: `Bearer ${sharedState.reg.step_one.res.jwt}`,
        "x-client-token": localStorage.getItem("x-client-token"),
        "x-subject-type": "standard",
      },
      data: { broker: false },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    /**
     *
     *
     *
     *
     *
     *
     *
     *
     */
  };

  /**
   * OTHER DATA WE WILL LOOP LATER
   */
  const assets_range = [
    {
      title: "₦0-₦9,000,000",
      value: 12500,
    },
    {
      value: 62500,
      title: "₦9,000,001-₦36,000,001",
    },
    {
      value: 175000,
      title: "₦36,000,001-₦90,000,000",
    },
    {
      value: 250000,
      title: "₦90,000,001+",
    },
  ];

  const risk_tolerance = [
    {
      value: "LOW",
      title: "Low Risk",
    },
    {
      value: "MODERATE",
      title: "Moderate Risk",
    },
    {
      value: "SPECULATION",
      title: "Speculative Risk",
    },
    {
      value: "HIGH",
      title: "High Risk",
    },
  ];

  const experience = [
    {
      value: "NONE",
      title: "None",
    },
    {
      value: "YRS_1_2",
      title: "1-2 years",
    },
    {
      value: "YRS_3_5",
      title: "3-5 years",
    },
    {
      value: "YRS_5_10",
      title: "5-10 years",
    },
    {
      value: "YRS_10_",
      title: "10+ years",
    },
  ];

  return (
    <div className="grid h-screen place-items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-4 py-7 w-1/3 sm:px-8"
      >
        <div className="space-y-4 bg-white">
          <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
            <h3
              className="w-48 text-2xl font-bold leading-7 text-gray-900"
              id="modal-title"
            >
              Investment Profile
            </h3>

            {!Object.keys(dictionary).length > 0 && <Spin />}
          </div>

          {/* <div className="text-2xs">{JSON.stringify(sharedState, null, 2)}</div> */}
          {/* <div className="text-2xs">{JSON.stringify(data, null, 2)}</div> */}

          <div className="flex items-center justify-between space-x-1">
            <div className="flex space-x-1">
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
            </div>

            <div className="text-2xs font-bold text-gray-600">Step 4 of 4</div>
          </div>
          {Object.keys(dictionary).length > 0 && (
            <div className="sm:items-start">
              <div className="overflow-hidden sm:rounded-md">
                <div className="bg-white">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          onChange={handleChange}
                          value={data.liquid}
                          name="liquid"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Liquidity"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          onChange={handleChange}
                          value={data.yearly_income}
                          name="yearly_income"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Yearly income"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">assets range</div>
                        <select
                          value={data.assets_range}
                          onChange={handleChange}
                          name="net_worth"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {assets_range.map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">Dependents</div>
                        <select
                          value={data.dependents}
                          onChange={handleChange}
                          name="dependents"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.dependents).map(
                            (key, index) => {
                              return (
                                <option key={key} value={key}>
                                  {dictionary.dependents[key]}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      {/* <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          source of wealth{" "}
                        </div>
                        <select
                          value={data.source_of_wealth}
                          onChange={handleChange}
                          name="source_of_wealth"
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.source_of_wealth).map(
                            (key, index) => {
                              return (
                                <option key={key} value={key}>
                                  {dictionary.source_of_wealth[key]}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div> */}

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          employment status
                        </div>
                        <select
                          value={data.employment_status}
                          onChange={handleChange}
                          required
                          name="employment_status"
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.employment_status).map(
                            (key, index) => {
                              return (
                                <option key={key} value={key}>
                                  {dictionary.employment_status[key]}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          employment type
                        </div>
                        <select
                          value={data.employment_type}
                          onChange={handleChange}
                          required
                          name="employment_type"
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.employment_type).map(
                            (key, index) => {
                              return (
                                <option key={key} value={key}>
                                  {dictionary.employment_type[key]}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">experience</div>
                        <select
                          value={data.experience}
                          onChange={handleChange}
                          name="experience"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {experience.map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">goal </div>
                        <select
                          value={data.goal}
                          onChange={handleChange}
                          name="goal"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.goal).map((key, index) => {
                            return (
                              <option key={key} value={key}>
                                {dictionary.goal[key]}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          marital status
                        </div>
                        <select
                          value={data.martial_status}
                          onChange={handleChange}
                          name="martial_status"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.martial_status).map(
                            (key, index) => {
                              return (
                                <option key={key} value={key}>
                                  {dictionary.martial_status[key]}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">position</div>
                        <select
                          value={data.position}
                          onChange={handleChange}
                          name="position"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {Object.keys(dictionary.position).map(
                            (key, index) => {
                              return (
                                <option key={key} value={key}>
                                  {dictionary.position[key]}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          risk tolerance
                        </div>
                        <select
                          value={data.risk_tolerance}
                          onChange={handleChange}
                          name="risk_tolerance"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option>--Select--</option>
                          {risk_tolerance.map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push("/stocks/create/step-three")}
            type="submit"
            className="btn flex w-36 justify-between place-self-end border-none bg-gray-500 capitalize hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 -rotate-180"
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

            <div>Back</div>
          </button>

          <button
            type="submit"
            disabled={loading ? true : false}
            className="btn flex w-36 justify-between place-self-end border-none bg-[#2D7EC2] capitalize hover:bg-[#27669B]"
          >
            {loading ? <Spin /> : <div>Complete</div>}
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

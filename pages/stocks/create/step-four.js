import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useAppContext } from "../../../lib/contexts/globalState";
import { bamboo, isCancelled } from "../../../lib/bamboo";
import Spin from "../../../components/Misc/Spin";

// Bamboo's dictionary lists each field as [{VALUE: "Label"}, ...].
const normalise = (raw) =>
  Object.fromEntries(
    Object.entries(raw || {}).map(([key, value]) => [
      key,
      Array.isArray(value) ? Object.assign({}, ...value) : value || {},
    ])
  );

export default function StepFour() {
  const router = useRouter();
  const [sharedState, updateSharedState] = useAppContext();
  const [loading, setLoading] = useState(false);
  const [unknown, setUnknown] = useState(false);
  const [dictionary, setDictionary] = useState({});
  const reference = useRef(uuid());
  const submitting = useRef(false);
  const [data, setData] = useState({
    employment_status: "",
    employment_type: "",
    company: "",
    position: "",
    source_of_wealth: "",
    marital_status: "",
    goal: "",
    experience: "",
    risk_tolerance: "",
    liquid: "",
    net_worth: "",
    yearly_income: "",
    broker: false,
    director_of: "",
    extended_hours: false,
    intent_to_deposit: false,
  });

  useEffect(() => {
    if (!Object.keys(sharedState.reg.step_three).length) {
      router.push("/stocks/create/step-one");
      return;
    }
    // set data
    Object.keys(sharedState.reg.step_four).length > 0 &&
      setData({ ...data, ...sharedState.reg.step_four });
    // get dictionary
    const controller = new AbortController();
    bamboo("/dictionary", { signal: controller.signal })
      .then((value) => setDictionary(normalise(value)))
      .catch((e) => {
        if (!isCancelled(e)) toast.error(e.message);
      });
    return () => controller.abort();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  const options = (field, fallback = []) => {
    const values = dictionary[field] || {};
    return Object.keys(values).length
      ? Object.entries(values).map(([value, title]) => ({ value, title }))
      : fallback;
  };

  /**
   *
   * COMPLETE
   * ACCOUNT
   * REGISTRATION
   *
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current || unknown) return;
    const one = sharedState.reg.step_one.info;
    const three = sharedState.reg.step_three;
    if (!Object.keys(one).length || !Object.keys(three).length)
      return router.push("/stocks/create/step-one");

    updateSharedState({
      ...sharedState,
      reg: { ...sharedState.reg, step_four: data },
    });

    const basic_info = {
      first_name: one.name,
      last_name: one.surname,
      email: one.email,
      phone_number: one.phone_number,
      date_of_birth: one.date_of_birth,
      gender: one.gender,
      citizenship: one.citizenship,
      country_code: one.country_code,
      residence_country_code: one.residence_country_code,
      city: one.city,
      province: one.province,
      postal_code: one.postal_code,
    };
    const body = {
      reference: reference.current,
      intent_to_deposit: data.intent_to_deposit,
      identity_verified: three.verified,
      basic_info,
      verified_identity_info: {
        document_type: three.identification_document_type,
        identifier: three.identifier,
        address: three.address,
        image: three.image,
        city: one.city,
        state: one.province,
        date_of_birth: one.date_of_birth,
        email: one.email,
        full_name: `${one.name} ${one.surname}`,
        gender: one.gender,
        phone_number: one.phone_number,
        residence_country: one.residence_country_code,
      },
      affiliation_info: {
        broker: data.broker,
        director_of: data.director_of || null,
      },
      brokerage_account_info: {
        employment_status: data.employment_status,
        employment_type: data.employment_type,
        company: data.company,
        position: data.position,
        source_of_wealth: data.source_of_wealth,
        marital_status: data.marital_status,
        goal: data.goal,
        experience: data.experience,
        risk_tolerance: data.risk_tolerance,
        liquid: Number(data.liquid),
        net_worth: Number(data.net_worth),
        yearly_income: Number(data.yearly_income),
        ...(data.extended_hours ? { extended_hours_opt_in: "REQUESTED" } : {}),
      },
    };

    submitting.current = true;
    setLoading(true);
    try {
      await bamboo("/accounts", { method: "POST", data: body });
      toast.success("Registration complete.");
      updateSharedState({
        ...sharedState,
        reg: { step_one: { info: {}, res: {} }, step_two: {}, step_three: {}, step_four: {} },
      });
      router.push("/stocks/dashboard");
    } catch (e) {
      toast.error(e.message ?? "An error occured. Check your data.");
      if (e.code === "outcome_unknown" || !e.response || e.response?.status >= 500) {
        setUnknown(true);
      } else if (e.code === "upstream_error" || e.code === "previously_rejected") {
        reference.current = uuid();
      }
    } finally {
      submitting.current = false;
      setLoading(false);
    }
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
              {/* <span className="text-xs block">
                {JSON.stringify(sharedState)}
              </span> */}
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
                          inputMode="numeric"
                          pattern="[0-9]+"
                          title="Whole number"
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
                          inputMode="numeric"
                          pattern="[0-9]+"
                          title="Whole number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Yearly income"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">assets range</div>
                        <select
                          value={data.net_worth}
                          onChange={handleChange}
                          name="net_worth"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option value="">--Select--</option>
                          {assets_range.map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          source of wealth
                        </div>
                        <select
                          value={data.source_of_wealth}
                          onChange={handleChange}
                          name="source_of_wealth"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option value="">--Select--</option>
                          {options("source_of_wealth").map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>

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
                          <option value="">--Select--</option>
                          {options("employment_status").map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
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
                          <option value="">--Select--</option>
                          {options("employment_type").map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">company</div>
                        <input
                          type="text"
                          onChange={handleChange}
                          value={data.company}
                          name="company"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Employer"
                        />
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
                          <option value="">--Select--</option>
                          {options("experience", experience).map((a) => (
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
                          <option value="">--Select--</option>
                          {options("goal").map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-2xs capitalize">
                          marital status
                        </div>
                        <select
                          value={data.marital_status}
                          onChange={handleChange}
                          name="marital_status"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 capitalize shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        >
                          <option value="">--Select--</option>
                          {options("marital_status").map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
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
                          <option value="">--Select--</option>
                          {options("position").map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
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
                          <option value="">--Select--</option>
                          {options("risk_tolerance", risk_tolerance).map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-2xs">
                    <input
                      type="text"
                      onChange={handleChange}
                      value={data.director_of}
                      name="director_of"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="Public company directorships, if any"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="broker"
                        checked={data.broker}
                        onChange={handleChange}
                        className="rounded border-gray-300 focus:ring-0"
                      />
                      <span>Affiliated with a broker or dealer</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="extended_hours"
                        checked={data.extended_hours}
                        onChange={handleChange}
                        className="rounded border-gray-300 focus:ring-0"
                      />
                      <span>Request extended-hours trading</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="intent_to_deposit"
                        required
                        checked={data.intent_to_deposit}
                        onChange={handleChange}
                        className="rounded border-gray-300 focus:ring-0"
                      />
                      <span>Ready to make the first deposit</span>
                    </label>
                    {unknown && (
                      <div className="text-red-500">
                        Registration outcome needs checking. Reference:{" "}
                        {reference.current}. Do not submit again.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push("/stocks/create/step-three")}
            type="button"
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
            disabled={loading || unknown ? true : false}
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

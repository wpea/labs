import { useRouter } from "next/router";
import { useAppContext } from "../../../lib/contexts/globalState";
import Spin from "./../../../components/Misc/Spin";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { b_header_one } from "../../../lib/api";

export default function StepTwo() {
  const [sharedState, updateSharedState] = useAppContext();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    verification_code: "",
    phone_number: "",
  });

  useEffect(() => {
    setData({
      ...data,
      phone_number: sharedState.reg.step_one.info.phone_number,
    });
  }, []);

  const router = useRouter();

  /** Submit phone verification code */
  const handleSubmit = (e) => {
    e.preventDefault();

    /** 
     * Check to know if to skip to next page because verification already done
     */

    // skip to step three
    return router.push(`/stocks/create/step-three`);

    setLoading(true);

    fetch(
      "https://powered-by-bamboo-sandbox.investbamboo.com/api/verify_phone_number",
      {
        method: "POST", // or 'PUT'
        /**
         * find a way to generate and pass in the x-client-token on create new user account
         * */
        headers: b_header_one(localStorage.getItem("x-client-token")),
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((rdata) => {
        console.log(rdata);

        /**
         * Note -> Still in progress, confirm from bamboo devs what error message to expect.
         */
        if (rdata.errors) {
          setLoading(false);
          toast.error("An error occured. Check your data.");
        } else {
          // updateSharedState({
          //   ...sharedState,
          //   reg: {
          //     ...sharedState.reg,
          //     step_two: { data },
          //   },
          // });

          // -> Skip to page 3 for now

          router.push(`/stocks/create/step-three`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }

  return (
    <div className="grid h-screen place-items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-4 py-7 w-1/3 sm:px-8"
      >
        <div className="space-y-4 bg-white">
          <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
            <h3
              className="w-48 text-2xl font-bold leading-6 text-gray-900"
              id="modal-title"
            >
              Verify phone number
            </h3>
          </div>

          {/* <div className="text-2xs">{JSON.stringify(sharedState, null, 2)}</div> */}
          {/* <div className="text-2xs">{JSON.stringify(data, null, 2)} </div> */}

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
            </div>

            <div className="text-2xs font-bold text-gray-600">Step 2 of 4</div>
          </div>

          <div className="sm:items-start">
            <div className="overflow-hidden sm:rounded-md">
              <div className="bg-white">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 gap-4">
                    <div>
                      <input
                        type="text"
                        onChange={(e) =>
                          setData({
                            ...data,
                            verification_code: e.target.value,
                          })
                        }
                        value={data.verification_code}
                        name="verification_code"
                        required
                        className="mt-1 py-4 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Verification code"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => router.push("/stocks/create/step-one")}
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

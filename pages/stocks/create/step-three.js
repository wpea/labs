import { useRouter } from "next/router";
import { useAppContext } from "../../../lib/contexts/globalState";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function StepThree() {
  const router = useRouter();
  const [sharedState, updateSharedState] = useAppContext();
  const [data, setData] = useState({
    identification_document_type: "BVN",
    identifier: "",
    address: "",
    image: "",
    verified: false,
  });

  useEffect(() => {
    // Details from step one are kept in memory only; start again after a reload.
    if (!Object.keys(sharedState.reg.step_one.info).length)
      return router.push("/stocks/create/step-one");
    Object.keys(sharedState.reg.step_three).length > 0 &&
      setData({ ...data, ...sharedState.reg.step_three });
  }, []);

  const handleImage = (file) => {
    if (!file) return;
    if (
      file.size > 6 * 1024 * 1024 ||
      !["image/png", "image/jpeg"].includes(file.type)
    ) {
      return toast.error("Use a PNG or JPEG image up to 6 MB.");
    }
    const reader = new FileReader();
    reader.onload = () => setData((old) => ({ ...old, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.image) return toast.error("Add a passport photograph.");
    updateSharedState({
      ...sharedState,
      reg: { ...sharedState.reg, step_three: data },
    });
    router.push(`/stocks/create/step-four`);
  };

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
              Verify BVN
            </h3>
          </div>
          {/* <div className="text-2xs">{JSON.stringify(sharedState, null, 2)}</div> */}
          {/* <div className="text-2xs">
            {JSON.stringify(sharedState.reg.step_one.res.jwt, null, 2)}
          </div> */}

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
            </div>

            <div className="text-2xs font-bold text-gray-600">Step 3 of 4</div>
          </div>

          <div className="sm:items-start">
            <div className="overflow-hidden sm:rounded-md">
              <div className="bg-white">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 gap-4">
                    <div>
                      <input
                        type="text"
                        name="identifier"
                        onChange={(e) =>
                          setData({ ...data, identifier: e.target.value })
                        }
                        value={data.identifier}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 py-4 px-4 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="BVN Number"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="address"
                        onChange={(e) =>
                          setData({ ...data, address: e.target.value })
                        }
                        value={data.address}
                        required
                        className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Residential address"
                      />
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <div className="text-2xs capitalize">
                        passport photograph
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => handleImage(e.target.files[0])}
                        className="block w-full text-sm"
                      />
                      {data.image && (
                        <div className="text-2xs text-gray-500">
                          Photograph added.
                        </div>
                      )}
                    </div>

                    <label className="mt-4 flex items-center space-x-2 text-2xs">
                      <input
                        type="checkbox"
                        required
                        checked={data.verified}
                        onChange={(e) =>
                          setData({ ...data, verified: e.target.checked })
                        }
                        className="rounded border-gray-300 focus:ring-0"
                      />
                      <span>
                        I confirm these identity details have been
                        independently verified.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid">
          <div className="flex justify-between">
            <button
              onClick={() => router.push("/stocks/create/step-one")}
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
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { apiAddress } from "../../../lib/api";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function CompleteForStepFour() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    phone_number: "",
    password: "",
  });

  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    /**
     *
     */
    setLoading(true);

    var config = {
      method: "post",
      url: `${apiAddress}/stock/bamboo/login`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data,
    };

    axios(config)
      .then(function (response) {
        // return console.log(response.data.status);
        if (response.data.status !== 200) {
          toast.error(
            response?.data?.message ?? "An error occured. Check your data."
          );
          console.log(response);
          return setLoading(false);
        }

        if (response.data.status === 200) {
          localStorage.setItem("other", JSON.stringify(response?.data?.data));
          localStorage.setItem("other_user_data", JSON.stringify(data));
          setLoading(false);
          router.push(`/stocks/create/step-four`);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error?.response?.data?.message ?? "An error occured.");
        return setLoading(false);
      });
  };

  return (
    <>
      <div className="grid place-items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 shadow-lg border lg:w-1/4 border-gray-200 rounded-md p-8 space-y-6 grid"
        >
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold uppercase place-self-start px-2 py-1 rounded-md bg-green-100 border-green-300 text-green-500">
              Complete Bamboo Registraton
            </div>

            {/* {JSON.stringify(data)} */}
          </div>

          <div className="space-y-2.5">
            <div className="tracking-tight font-medium">
              Phone <span className="text-red-600">*</span>
            </div>
            <input
              type="text"
              name="phone_number"
              onChange={(e) =>
                setData({ ...data, phone_number: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="+234812345678"
            />
          </div>

          <div className="space-y-2.5">
            <div className="tracking-tight font-medium">
              Password <span className="text-red-600">*</span>
            </div>
            <input
              type="password"
              name="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder=""
            />
          </div>

          <button
            type="submit"
            className={`${
              loading === true ? `loading ` : null
            } btn btn-primary bg-blue-500 border-none hover:bg-blue-700 capitalize text-lg font-normal tracking-wide`}
          >
            Continue
          </button>
        </form>
      </div>
    </>
  );
}

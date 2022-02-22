import Head from "next/head";
import { useState, useEffect } from "react";
import { saveToken, getToken, loginAuth } from "../lib/hooks/useAuth";
import { useRouter } from "next/router";
import { useAppContext } from "../lib/contexts/globalState";

export default function Login() {
  const [sharedState, updateSharedState] = useAppContext();
  const [device, setDevice] = useState();
  const [token, setToken] = useState();
  const [canSubmit, setCanSubmit] = useState(false);
  const [errorBox, setErrorBox] = useState({
    info: "",
    status: false,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    device_name: "",
  });

  // Get tokens
  const handleSubmit = async () => {
    setLoading(true);

    // check that fields are not empty
    if (data.email === "" && data.password === "") {
      setLoading(false);
      return setErrorBox({ info: "Email & Password Required", status: true });
    }

    // await server response
    const res = await loginAuth(data);

    // check for errors
    if (res.errors) {
      setLoading(false);
      return setErrorBox({ info: "Invalid Credentials", status: true });
    } else {
      saveToken(res.token, res.user);
      router.push("/home");
    }

    updateSharedState({ ...sharedState, token: res.token });
    // console.log(res);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Get device after browser loads
  useEffect(() => {
    if (getToken()) router.push("/home");
    setData({ ...data, device_name: window.navigator.userAgent });
  }, []);

  const hideError = () => {
    setErrorBox(false);
  };

  return (
    <>
      <Head>
        <title>login &mdash; wplabs</title>
        <meta
          name="description"
          content="WP Labs Project - Innovating the family office."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="grid place-items-center min-h-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23b4b4b4' fill-opacity='0.1'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="bg-gray-50 shadow-lg border lg:w-1/4 border-gray-200 rounded-md p-8 space-y-6 grid">
          <div className="flex justify-between items-center">
            <img
              className="w-48 place-self-start"
              src="https://ik.imagekit.io/et8vxrzxxdj/wp/logo-4_ZwIPSuRP0ei.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1635862692581"
              alt="wplabs"
            />
            <div className="text-xs font-bold uppercase border place-self-start px-2 py-1 rounded-md bg-green-100 border-green-300 text-green-500">
              labs
            </div>
          </div>
          <hr />

          {errorBox.status && (
            <div className="flex items-center justify-between text-xs w-full font-bold uppercase border place-self-start px-2 py-1 rounded-md bg-red-100 border-red-300 text-red-500">
              <div>{errorBox.info}</div>
              <svg
                onClick={hideError}
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          <div className="space-y-2.5">
            <div className="tracking-tight font-medium">
              Email <span className="text-red-600">*</span>
            </div>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder=""
            />
          </div>

          <div className="space-y-2.5">
            <div className="tracking-tight font-medium">
              Password <span className="text-red-600">*</span>
            </div>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder=""
            />
          </div>

          <button
            onClick={handleSubmit}
            className={`${
              loading === true ? `loading ` : null
            } btn btn-primary bg-blue-500 border-none hover:bg-blue-700 capitalize text-lg font-normal tracking-wide`}
          >
            Log in
          </button>
          <hr />
          <span className="text-2xs tracking-tight text-center">
            &copy; WP Labs 2022 &mdash; Wealth Paradigm Ethical Advisory
          </span>
          {/* <div className="flex justify-between">
            <div className="text-2xs">
              {token ? token : "empty"} {JSON.stringify(data, null, 4)}
            </div>
            <svg
              onClick={deleteToken}
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div> */}
        </div>
      </div>
    </>
  );
}

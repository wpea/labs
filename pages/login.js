import Head from "next/head";
import { useState } from "react";

export default function Login() {
  const [token, setToken] = useState();
  const [device] = useState(navigator.userAgent);

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

      <div class="grid place-items-center min-h-screen">
        <div class="bg-gray-50 drop-shadow-sm border lg:w-1/4 border-gray-200 rounded-md p-8 space-y-6 grid">
          <div class="flex justify-between items-center">
            <img
              class="w-48 place-self-start"
              src="https://ik.imagekit.io/et8vxrzxxdj/wp/logo-4_ZwIPSuRP0ei.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1635862692581"
              alt="wplabs"
            />
            <div class="text-xs font-bold uppercase border place-self-start px-2 py-1 rounded-md bg-green-100 border-green-300 text-green-500">
              labs
            </div>
          </div>
          <hr />
          <div class="space-y-2.5">
            <div class="tracking-tight font-medium">
              Email <span class="text-red-600">*</span>
            </div>
            <input
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder=""
            />
          </div>

          <div class="space-y-2.5">
            <div class="tracking-tight font-medium">
              Password <span class="text-red-600">*</span>
            </div>
            <input
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder=""
            />
          </div>

          <button class="btn btn-primary bg-blue-500 border-none hover:bg-blue-700 capitalize text-lg font-normal tracking-wide">
            Log in
          </button>
          <hr />
          <span class="text-2xs tracking-tight text-center">
            &copy; WP Labs 2022 &mdash; Wealth Paradigm Ethical Advisory 
          </span>
          <div className="text-2xs">{device}</div>
        </div>
      </div>
    </>
  );
}

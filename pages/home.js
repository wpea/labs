import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "../components/spinner";

export default function Home() {
  const [token, setToken] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  return token ? (
    <>
      <Head>
        <title>home &mdash; wplabs</title>
        <meta
          name="description"
          content="WP Labs Project - Innovating the family office."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full grid">
        <div className="md:px-20 p-10 space-y-10 grid">
          <div className="grid grid-cols-2">
            <div>
              <img
                className="w-36"
                src="https://ik.imagekit.io/et8vxrzxxdj/wp/wplabs_fnNIZEWBNs.svg"
                alt="wplabs"
              />
            </div>
            <div className="text-xs self-center justify-self-end">
              Innovating the family office.
            </div>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="bg-gray-50 hover:border-gray-400 border border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid">
              <div className="bg-blue-200 place-self-start rounded-full justify-self-start p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-blue-500 h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Projects
                </div>
                <div className="text-2xs tracking-tight">
                  Create and manage projects, milestones and tasks all from one
                  place.
                </div>
              </div>
            </div>

            <div className="bg-gray-50 hover:border-gray-400 border  border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid">
              <div className="bg-blue-200 place-self-start rounded-full justify-self-start p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-blue-500 h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  FM Onboard
                </div>
                <div className="text-2xs tracking-tight">
                  Family office individual onboarding form.
                </div>
              </div>
            </div>

            <div className="bg-gray-50 opacity-60 border border-gray-200 rounded-md p-8 space-y-4 grid">
              <div className="bg-blue-200 rounded-full place-self-start justify-self-start p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-blue-500 h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Billing
                </div>
                <div className="text-2xs tracking-tight">
                  Create, send and manage invoices &amp; receipts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Spinner />
  );
}

import Head from "next/head";
import AppLayout from "./../components/Layouts/AppLayout";
import { useAuth2 } from "./../lib/hooks/useAuth2";
import { useRouter } from "next/router";
import Header from "./../components/header";

export default function HomeCards() {
  const router = useRouter();

  return (
    <AppLayout>
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
          <Header />

          <div className="grid grid-cols-4 gap-8">
            <div
              onClick={() => {
                router.push("/projects");
              }}
              className="bg-gray-50 hover:border-gray-400 border border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
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
                  Taskinator
                </div>
                <div className="text-2xs tracking-tight">
                  Create and manage projects, milestones and tasks all from one
                  place.
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                router.push("https://onboard.wealthparadigm.org/");
              }}
              className="bg-gray-50 hover:border-gray-400 border  border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
              <div className="bg-blue-200 place-self-start rounded-full justify-self-start p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-blue-500 h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
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

            <div
              // onClick={() => {
              //   router.push("/club/interest");
              // }}
              className="bg-gray-50 opacity-60 border border-gray-200 rounded-md p-8 space-y-4 grid"
            >
              <div className="bg-blue-200 place-self-start rounded-full justify-self-start p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-blue-500 h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Clubs
                </div>
                <div className="text-2xs tracking-tight">
                  Investment club short survey form & responses.
                </div>
              </div>
            </div>

            <div
              onClick={() => router.push("/stocks")}
              className="bg-gray-50 hover:border-gray-400 border  border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
              <div className="bg-blue-200 rounded-full place-self-start justify-self-start p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-blue-500 h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Stocks
                </div>
                <div className="text-2xs tracking-tight">View stocks data.</div>
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

            <div
              onClick={() => router.push("/temp-report")}
              className="bg-yellow-50 hover:border-yellow-400 border  border-yellow-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
              <div className="flex items-center justify-between">
                <div className="bg-yellow-200 rounded-full place-self-start justify-self-start p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="fill-current text-yellow-500 h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Temp-Reporting
                </div>
                <div className="text-2xs tracking-tight">
                  Temporary Reporting Dashboard for Jamila.
                </div>
              </div>
            </div>

            <div
              onClick={() => router.push("/asset-allocation")}
              className="bg-gray-50 hover:border-gray-400 border  border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
              <div className="flex items-center justify-between">
                <div className="bg-blue-200 rounded-full place-self-start justify-self-start p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="fill-current text-blue-500 h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                    />
                  </svg>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Fund Managers
                </div>
                <div className="text-2xs tracking-tight">
                  Overview of Asset Managers
                </div>
              </div>
            </div>

            <div
              onClick={() => router.push("/hisab")}
              className="bg-gray-50 hover:border-gray-400 border  border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
              <div className="flex items-center justify-between">
                <div className="bg-blue-200 rounded-full place-self-start justify-self-start p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-blue-500 p-1 w-8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.787 7.531c-5.107 2.785-12.72 9.177-15.787 15.469h2.939c.819-2.021 2.522-4.536 3.851-5.902 8.386 3.747 17.21-2.775 17.21-11.343 0-1.535-.302-3.136-.92-4.755-2.347 3.119-5.647 1.052-10.851 1.625-7.657.844-11.162 6.797-8.764 11.54 3.506-3.415 9.523-6.38 12.322-6.634z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Hisab
                </div>
                <div className="text-2xs tracking-tight">
                  Manage users, view stats and more
                </div>
              </div>
            </div>

            <div
              onClick={() => router.push("/reports")}
              className="bg-gray-50 hover:border-gray-400 border  border-gray-200 cursor-pointer rounded-md p-8 space-y-4 grid"
            >
              <div className="flex items-center justify-between">
                <div className="bg-blue-200 rounded-full place-self-start justify-self-start p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-blue-500 p-1 w-8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.568.075c2.202 1.174 5.938 4.883 7.432 6.881-1.286-.9-4.044-1.657-6.091-1.179.222-1.468-.185-4.534-1.341-5.702zm7.432 10.925v13h-20v-24h8.409c4.857 0 3.335 8 3.335 8 3.009-.745 8.256-.419 8.256 3zm-16 5h5v-4h-5v4zm12 2h-12v1h12v-1zm0-3h-5v1h5v-1zm0-3h-5v1h5v-1z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl tracking-tight font-bold text-gray-700">
                  Reports
                </div>
                <div className="text-2xs tracking-tight">
                  Upload csv client reports.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

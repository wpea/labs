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
                  Fund Managers
                </div>
                <div className="text-2xs tracking-tight">
                  Overview of Asset Managers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

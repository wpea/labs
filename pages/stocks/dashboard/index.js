import AppLayout from "../../../components/Layouts/AppLayout";
import Head from "next/head";
import Header from "./../../../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiAddress } from "../../../lib/api";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getStockAccounts();
  }, []);

  const encrypt = (text) => {
    const passphrase = "wplabs";
    return CryptoJS.AES.encrypt(text, passphrase).toString();
  };

  const getStockAccounts = async () => {
    const res = await axios.get(`${apiAddress}/stocks/account`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        Accept: "application/json",
      },
    });

    setAccounts(res.data.data);
    // console.log(accounts);
  };

  const goToAccount = (id) => {
    // pass param to the dashboard page
    const account = accounts.filter((a) => a.id === id);
    // set data in localStorage()
    localStorage.setItem(
      "account",
      JSON.stringify({
        id: account[0].id,
      })
    );
    // pass param as a push to the dashboard page
    router.push("/stocks/dashboard/account");
  };

  return (
    <AppLayout>
      <Head>
        <title>home &mdash; stocks dashboard</title>
        <meta
          name="description"
          content="WP Stocks - Innovating the family office."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full grid">
        <div className="md:px-20 p-10 space-y-10 grid">
          <Header />
        </div>
      </div>

      {accounts.length > 0 ? (
        <div className="p-10 md:px-20 space-y-10">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold tracking-normal">
              Stock accounts
            </div>
            <div className="font-bold text-gray-400">{accounts.length}</div>
          </div>

          {accounts.map((a) => (
            <div key={a.id} className="relative overflow-x-auto sm:rounded-lg">
              <div className="rounded-md bg-gray-100 px-6">
                <div className="flex items-center justify-between  py-6">
                  <div className="font-bold">{`${a.surname} ${a.firstname}`}</div>
                  <button
                    onClick={() => goToAccount(a.id)}
                    className="btn flex w-36 justify-between place-self-end border-none bg-[#2D7EC2] capitalize hover:bg-[#27669B]"
                  >
                    <div>Manage</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 grid place-items-center">
          Create a stock account to get started.
        </div>
      )}
    </AppLayout>
  );
}

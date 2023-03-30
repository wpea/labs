import { useState, useEffect } from "react";
import axios from "axios";
import { apiAddress, bambooLive } from "../../../../lib/api";
import Deposit from "../../../../components/Stocks/Deposit";
import Spin from "./../../../../components/Misc/Spin";
import { useRouter } from "next/router";
import Trade from "./../../../../components/Stocks/Trade";
import StockInfo from "../../../../components/Stocks/StockInfo";
import PendingOrder from "../../../../components/Stocks/PendingOrder";
import Withdraw from "../../../../components/Stocks/Withdraw";
import toast from "react-hot-toast";

import AppLayout from './../../../../components/Layouts/AppLayout';

export default function Account() {
  const [account, setAccount] = useState({});
  const [portOne, setPortOne] = useState({});
  const [portTwo, setPortTwo] = useState({});
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const [checkOrder, setCheckOrder] = useState(false);

  const router = useRouter();

  const [showDep, setShowDep] = useState(false);
  const [showTr, setShowTr] = useState(false);
  const [showWd, setShowWd] = useState(false);

  const config = (method, url, auth) => {
    return {
      method: method,
      url: url,
      headers: {
        "x-subject-type": "standard",
        authorization: `Bearer ${auth}`,
        "x-client-token": localStorage.getItem("x-client-token"),
      },
    };
  };

  const config2 = (method, url, jwt) => {
    return {
      method: method,
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: { jwt: jwt},
    };
  }

  const currVal = (val) => {
    // return formatValue({
    //   value: `${val}`,
    //   groupSeparator: ",",
    //   decimalSeparator: ".",
    //   prefix: "$",
    // });

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(val);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  useEffect(async () => {
    /**
     *
     * CALL TO GET THE JWT
     *
     */
    const account = JSON.parse(localStorage.getItem("account"));
    getJwt(account);
    /** wait for 3 seconds, why? I don't know for sure yet! but its better so it
     *  fail.
     */
    setLoading(true);
    await sleep(3000);
    getPortfolioBreakdown();
    await sleep(3000);
    getPortfolio();
    await sleep(3000);
    getAccountStocks();
    getPendingOrders();
    setLoading(false);
  }, [showTr]);
  // When trades and deposits are complete
  // showTr, showDep;

  /**
   *
   * GET AND STORE JWT TO LOCALSTORAGE
   *
   */
  const getJwt = async (a) => {
    const res = await axios.get(`${apiAddress}/user/jwt/${a.id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    // console.log(res);
    setAccount(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("x-client-token", res.data.admin);
  };

  /**
   *
   * GET USER ACCOUNT DETAILS (PORTFOLIO)
   *
   */
  const getPortfolio = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    axios(config2(`post`, `${apiAddress}/stock/account/portfolio`, user.jwt))
      .then(function (response) {
        // return console.log(response.data.status);
        if (response.data.status !== 200) {
          toast.error(
            response.data.message ?? "An error occured. Kindly refresh this page."
          );
          console.log(response);
          return setLoading(false);
        }
        if (response.data.status === 200) {
          console.log(response);
          setPortOne(response.data.data);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        return setLoading(false);
      });
  };

  const getPortfolioBreakdown = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    axios(config2(`post`, `${apiAddress}/stock/account/portfolio/breakdown`, user.jwt))
      .then(function (response) {
        if (response.data.status !== 200) {
          toast.error(
            response.data.message ??
              "An error occured. Kindly refresh this page."
          );
          console.log(response);
          return setLoading(false);
        }
        if (response.data.status === 200) {
          console.log(response);
          setPortTwo(response.data.data);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        return setLoading(false);
      });
  };

  const getAccountStocks = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    axios(config2(`post`, `${apiAddress}/stock/account/stocks`, user.jwt))
      .then(function (response) {
        // return console.log(response.data.status);
        if (response.data.status !== 200) {
          toast.error(
            response.data.message ??
              "An error occured. Kindly refresh this page."
          );
          console.log(response);
          return setLoading(false);
        }
        if (response.data.status === 200) {
          console.log(response);
          // setPortOne(response.data.data);
          setStocks(response.data.data.stocks);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        return setLoading(false);
      });
  };

  const getPendingOrders = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    axios(
      config2(`post`, `${apiAddress}/stock/account/pending_orders`, user.jwt)
    )
      .then(function (response) {
        // return console.log(response.data.status);
        if (response.data.status !== 200) {
          toast.error(
            response.data.message ??
              "An error occured. Kindly refresh this page."
          );
          console.log(response);
          return setLoading(false);
        }
        if (response.data.status === 200) {
          console.log(response);
          setPendingOrders(response.data.data.pending_orders);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        return setLoading(false);
      });
  };

  return (
    <AppLayout>
      <div className="grid w-full">
        <div className="grid space-y-10">
          <div
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 40' width='80' height='40'%3E%3Cpath fill='%23ffffff' fill-opacity='0.05' d='M0 40a19.96 19.96 0 0 1 5.9-14.11 20.17 20.17 0 0 1 19.44-5.2A20 20 0 0 1 20.2 40H0zM65.32.75A20.02 20.02 0 0 1 40.8 25.26 20.02 20.02 0 0 1 65.32.76zM.07 0h20.1l-.08.07A20.02 20.02 0 0 1 .75 5.25 20.08 20.08 0 0 1 .07 0zm1.94 40h2.53l4.26-4.24v-9.78A17.96 17.96 0 0 0 2 40zm5.38 0h9.8a17.98 17.98 0 0 0 6.67-16.42L7.4 40zm3.43-15.42v9.17l11.62-11.59c-3.97-.5-8.08.3-11.62 2.42zm32.86-.78A18 18 0 0 0 63.85 3.63L43.68 23.8zm7.2-19.17v9.15L62.43 2.22c-3.96-.5-8.05.3-11.57 2.4zm-3.49 2.72c-4.1 4.1-5.81 9.69-5.13 15.03l6.61-6.6V6.02c-.51.41-1 .85-1.48 1.33zM17.18 0H7.42L3.64 3.78A18 18 0 0 0 17.18 0zM2.08 0c-.01.8.04 1.58.14 2.37L4.59 0H2.07z'%3E%3C/path%3E%3C/svg%3E")`,
            }}
            className="grid h-60 space-y-10 py-10 bg-[#2D7EC2] px-20 text-white"
          >
            <div className="grid grid-cols-2 self-center">
              <div className="self-center font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 fill-current"
                  viewBox="0 0 37.11 37.12"
                >
                  <path d="M18.55,0A18.56,18.56,0,1,0,37.11,18.56,18.56,18.56,0,0,0,18.55,0ZM14.21,20.83s-3.32.17-5.27-1.77-1.79-5.28-1.79-5.28,3.34-.17,5.28,1.77S14.21,20.83,14.21,20.83Zm5.1-.79v6.82a4.1,4.1,0,0,1-3.37,4V20A14.67,14.67,0,0,1,20.27,9.63l-.73-.73h3.84v3.84L22.65,12h0a11.41,11.41,0,0,0-2.45,3.67A11.25,11.25,0,0,0,19.31,20Zm8.39,1.08c-2.48,2.47-6.7,2.25-6.7,2.25s-.22-4.23,2.25-6.7S30,14.41,30,14.41,30.17,18.64,27.7,21.12Z" />
                </svg>
              </div>
              <div className="space-y-3 place-self-end self-end">
                <div className="text-right text-xs">
                  Innovating the family office.
                </div>
                <button
                  onClick={() => router.push("/stocks/dashboard")}
                  className="btn btn-outline btn-sm space-x-3 border-white text-white hover:border-white hover:bg-transparent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="0.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <div>Go back to accounts</div>
                </button>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2">
                <div className="space-y-1 self-center">
                  <div className="text-4xl font-ibm">
                    {currVal(portTwo?.total_aum ?? 0)}
                  </div>
                  <div className="text-2xs uppercase tracking-widest">
                    total Value
                  </div>
                </div>
                <div className="grid space-y-2 self-center justify-self-end text-xs">
                  {/* <div className="flex cursor-pointer items-center space-x-2 place-self-end hover:text-gray-200">
                    <div>Account</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div>UFIC Investment Club (Z. Zee)</div> */}
                  {loading && (
                    <svg
                      className="fill-current text-white"
                      version="1.1"
                      id="L9"
                      x="0px"
                      y="0px"
                      height="50px"
                      width="50px"
                      viewBox="0 0 100 100"
                      enableBackground="new 0 0 0 0"
                    >
                      <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          dur="0.4s"
                          from="0 50 50"
                          to="360 50 50"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* {JSON.stringify(portOne, null, 2)}
          {JSON.stringify(portTwo, null, 2)} */}

          <div className="grid h-48 grid-cols-2 p-10 md:px-20">
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  total invested
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.total_invested ?? 0)}
                </div>

                <div className="flex items-center space-x-1">
                  <div
                    className={`place-self-start rounded-md ${
                      portTwo?.total_percent_change > 0
                        ? `text-green-600`
                        : `text-red-600`
                    }`}
                  >
                    {portTwo?.total_percent_change > 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 -rotate-45"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 rotate-45"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`"text-sm font-ibm ${
                      portTwo?.total_percent_change > 0
                        ? `text-green-600`
                        : `text-red-600`
                    }`}
                  >
                    {portTwo?.total_percent_change}%
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  returns
                </div>
                <div
                  className={`${
                    portTwo?.total_return > 0
                      ? `text-green-600`
                      : `text-red-600`
                  } text-2xl font-ibm font-medium`}
                >
                  {currVal(portTwo?.total_return ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  equity value
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.equity_value ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  available to invest
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.available_to_invest ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  pending deposit
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portOne?.pending_deposit ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  usd to ngn
                </div>
                <div className="text-2xl font-ibm text-gray-400 font-medium">
                  {currVal(portOne?.usd_to_naira ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  withdrawable
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.withdrawal_cash ?? 0)}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 place-self-start justify-self-end">
              <button
                onClick={() => setShowTr(!showTr)}
                className="btn flex w-36 justify-between place-self-end border-none bg-[#2D7EC2] capitalize hover:bg-[#27669B]"
              >
                <div>Trade</div>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* <button
                onClick={() => setShowDep(!showDep)}
                className="btn flex w-36 justify-between place-self-end border-none bg-green-600 capitalize hover:bg-green-700"
              >
                <div>Deposit</div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 rotate-180 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 173.49 146.93"
                >
                  <path
                    className="cls-1"
                    d="M134.4,61.21h23.32A12.77,12.77,0,0,1,170.49,74v57.19a12.76,12.76,0,0,1-12.77,12.76h-142A12.76,12.76,0,0,1,3,131.17V74A12.76,12.76,0,0,1,15.76,61.21H39.08"
                  />
                  <path
                    className="cls-1"
                    d="M134.4,112.28H39.09V9.37A6.37,6.37,0,0,1,45.46,3H128a6.37,6.37,0,0,1,6.37,6.37Z"
                  />
                  <line
                    className="cls-1"
                    x1="134.23"
                    y1="13.21"
                    x2="39.26"
                    y2="13.21"
                  />
                  <line
                    className="cls-1"
                    x1="134.23"
                    y1="25.3"
                    x2="39.26"
                    y2="25.3"
                  />
                  <polyline
                    className="cls-1"
                    points="134.41 91.68 146.75 91.68 146.75 112.62 26.75 112.62 26.75 91.68 39.09 91.68"
                  />
                  <polyline
                    className="cls-1"
                    points="65.23 63.6 86.94 41.89 108.26 63.21"
                  />
                  <line
                    className="cls-1"
                    x1="86.74"
                    y1="41.89"
                    x2="86.74"
                    y2="99.34"
                  />
                </svg>
              </button> */}

              {/* <button
                onClick={() => setShowWd(!showWd)}
                type="submit"
                className="btn flex w-36 justify-between place-self-end border-none bg-gray-700 capitalize hover:bg-gray-900"
              >
                <div>Withdraw</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 173.49 146.93"
                >
                  <path
                    className="cls-1"
                    d="M134.4,61.21h23.32A12.77,12.77,0,0,1,170.49,74v57.19a12.76,12.76,0,0,1-12.77,12.76h-142A12.76,12.76,0,0,1,3,131.17V74A12.76,12.76,0,0,1,15.76,61.21H39.08"
                  />
                  <path
                    className="cls-1"
                    d="M134.4,112.28H39.09V9.37A6.37,6.37,0,0,1,45.46,3H128a6.37,6.37,0,0,1,6.37,6.37Z"
                  />
                  <line
                    className="cls-1"
                    x1="134.23"
                    y1="13.21"
                    x2="39.26"
                    y2="13.21"
                  />
                  <line
                    className="cls-1"
                    x1="134.23"
                    y1="25.3"
                    x2="39.26"
                    y2="25.3"
                  />
                  <polyline
                    className="cls-1"
                    points="134.41 91.68 146.75 91.68 146.75 112.62 26.75 112.62 26.75 91.68 39.09 91.68"
                  />
                  <polyline
                    className="cls-1"
                    points="65.23 63.6 86.94 41.89 108.26 63.21"
                  />
                  <line
                    className="cls-1"
                    x1="86.74"
                    y1="41.89"
                    x2="86.74"
                    y2="99.34"
                  />
                </svg>
              </button> */}
            </div>
          </div>
        </div>

        {/** Select active stocks or pending orders. */}
        <div className="grid grid-cols-4 px-20 pt-16"> 
          <div
            onClick={() => setCheckOrder(false)}
            className={`${
              !checkOrder && `bg-gray-800 text-white`
            } flex cursor-pointer items-center justify-between rounded-tl-2xl border-t border-r border-l bg-gray-50 py-4 px-7 pt-5`}
          >
            <div className="flex items-center space-x-2 text-xs font-bold uppercase">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              <div>stock portfolio</div>
            </div>

            <div className="font-ibm text-xl font-normal text-green-400">
              {stocks.length}
            </div>
          </div>

          <div
            onClick={() => setCheckOrder(true)}
            className={`${
              checkOrder && `bg-gray-800 text-white`
            } flex cursor-pointer items-center justify-between rounded-tr-2xl border-t border-r border-l bg-gray-50 py-4 px-7 pt-5`}
          >
            <div className="flex items-center space-x-2 text-xs font-bold uppercase">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-6 w-6 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>

              <div>pending orders</div>
            </div>

            <div className="font-ibm text-xl font-normal text-red-500">
              {pendingOrders.length}
            </div>
          </div>
        </div>

        {!checkOrder ? (
          stocks.length > 0 && (
            <>
              {stocks.map((s) => (
                <StockInfo
                  key={s?.symbol}
                  bg={s?.background_color}
                  name={s?.name}
                  symbol={s?.symbol}
                  perc_change={Math.ceil(s?.percent_change * 100) / 100}
                  price={Math.ceil(s?.price * 100) / 100}
                  quantity={Math.ceil(s?.quantity * 100) / 100}
                  total_return={Math.ceil(s?.total_return * 100) / 100}
                  value_change={Math.ceil(s?.value_change * 100) / 100}
                  equity={Math.ceil(s?.user_equity * 100) / 100}
                  logo={s?.logo}
                  s_data={s}
                />
              ))}
            </>
          )
        ) : (
          <div>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((p) => (
                <PendingOrder
                  key={p?.symbol}
                  name={p?.name}
                  symbol={p?.symbol}
                  status={p?.status}
                  side={p?.side}
                  fee={Math.ceil(p?.fee * 100) / 100}
                  pps={Math.ceil(p?.price_per_share * 100) / 100}
                  price={Math.ceil(p?.order_price * 100) / 100}
                  quantity={Math.ceil(p?.quantity * 100) / 100}
                  logo={p?.logo}
                />
              ))
            ) : (
              <div className="grid place-items-center border-t text-gray-400 uppercase text-xs font-medium tracking-wide py-12">
                <div> No pending orders.</div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs py-20 px-20">
          <div className="self-center flex items-center justify-between text-xs">
            <div>&copy; 2022 WPEA Labs</div>
          </div>
        </div>
      </div>

      {/* <>
        <Deposit showDep={showDep} toggleAdd={() => setShowDep(!showDep)} />
      </> */}

      <>
        <Trade showDep={showTr} toggleAdd={() => setShowTr(!showTr)} />
      </>

      <>
        <Withdraw showDep={showWd} toggleAdd={() => setShowWd(!showWd)} />
      </>
    </AppLayout>
  );
}

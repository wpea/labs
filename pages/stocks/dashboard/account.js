import { useState, useEffect } from "react";
import axios from "axios";
import { apiAddress } from "../../../lib/api";
import AppLayout from "./../../../components/Layouts/AppLayout";
import Deposit from "../../../components/Stocks/Deposit";
import Spin from "./../../../components/Misc/Spin";
import { useRouter } from "next/router";
import Trade from './../../../components/Stocks/Trade';

export default function Account() {
  const [account, setAccount] = useState({});
  const [portOne, setPortOne] = useState({});
  const [portTwo, setPortTwo] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [showDep, setShowDep] = useState(false);
  const [showTr, setShowTr] = useState(false);

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
     * fail.
     */
    setLoading(true);
    await sleep(3000);
    getPortfolioBreakdown();
    await sleep(3000);
    getPortfolio();
    // setLoading(false);
  }, []);

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
    /** PORT ONE */
    const res = await axios(
      config(
        "get",
        "https://powered-by-bamboo-sandbox.investbamboo.com/api/portfolio",
        user.jwt
      )
    );
    console.log(res);
    if (res.status === 200) setPortOne(res.data);
    setLoading(false);
  };

  const getPortfolioBreakdown = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    /** PORT BRKDWN */
    const res2 = await axios(
      config(
        "get",
        "https://powered-by-bamboo-sandbox.investbamboo.com/api/portfolio/breakdown",
        user.jwt
      )
    );
    console.log(res2);
    if (res2.status === 200) setPortTwo(res2.data);
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="grid w-full">
        <div className="grid space-y-10">
          <div className="grid h-60 space-y-10 py-10 bg-[#2D7EC2] px-20 text-white">
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
                  <div className="text-2xs uppercase tracking-widest">
                    total aum
                  </div>
                  <div className="text-4xl">{currVal(portTwo?.total_aum)}</div>
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
            <div className="flex space-x-16">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  total invested
                </div>
                <div className="text-2xl font-medium">
                  {currVal(portTwo?.total_invested ?? 0)}
                </div>

                <div className="flex items-center space-x-1">
                  <div className="place-self-start rounded-md bg-green-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-green-500">
                    {portTwo?.total_percent_change}%
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  total returns
                </div>
                <div className="text-2xl font-medium">
                  {currVal(portTwo?.total_return ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  equity value
                </div>
                <div className="text-2xl font-medium">
                  {currVal(portTwo?.equity_value ?? 0)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  available to invest
                </div>
                <div className="text-2xl font-medium">
                  {currVal(portTwo?.available_to_invest ?? 0)}
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

              <button
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
              </button>

              <button
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
              </button>
            </div>
          </div>
        </div>
      </div>

      <>
        <Deposit showDep={showDep} toggleAdd={() => setShowDep(!showDep)} />
      </>

      <>
        <Trade showDep={showTr} toggleAdd={() => setShowTr(!showTr)} />
      </>
    </AppLayout>
  );
}

import { useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../../../components/Layouts/AppLayout";
import Trade from "../../../../components/Stocks/Trade";
import Deposit from "../../../../components/Stocks/Deposit";
import Withdraw from "../../../../components/Stocks/Withdraw";
import StockInfo from "../../../../components/Stocks/StockInfo";
import PendingOrder from "../../../../components/Stocks/PendingOrder";
import WithdrawalItem from "../../../../components/Stocks/WithdrawalItem";
import Operations from "../../../../components/Stocks/Operations";
import AccountLink from "../../../../components/Stocks/AccountLink";
import useBambooAccount from "../../../../lib/hooks/useBambooAccount";
import { readJson } from "../../../../lib/bamboo";

export default function Account() {
  const router = useRouter();
  const accountId = router.isReady
    ? Number(router.query.account_id || readJson("account")?.id)
    : null;
  return <AccountView key={accountId || "none"} accountId={accountId} />;
}
function AccountView({ accountId }) {
  const router = useRouter();
  const {
    account,
    portfolio: portOne,
    breakdown: portTwo,
    stocks,
    pendingOrders,
    withdrawals,
    operations,
    withdrawalNext,
    operationNext,
    loading,
    errors,
    refresh,
    loadMore,
  } = useBambooAccount(accountId);
  const [activeTab, setActiveTab] = useState("stocks");
  const [showDep, setShowDep] = useState(false);
  const [showTr, setShowTr] = useState(false);
  const [showWd, setShowWd] = useState(false);
  const ready = account?.bamboo_status === "active" && !loading;
  const rounded = (value, digits = 2) =>
    value == null ? "—" : Number(Number(value).toFixed(digits));
  const currVal = (value) =>
    value == null
      ? "—"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(value));
  return (
    <AppLayout>
      <div className="grid w-full">
        <div className="px-10 lg:px-20 py-4 flex flex-wrap items-center gap-4 border-b">
          <span className="font-bold">
            {account
              ? `${account.firstname} ${account.surname}`
              : "Stock account"}
          </span>
          <span className="text-xs uppercase">
            {account?.bamboo_status || "Loading"}
          </span>
          <button
            className="btn btn-sm"
            disabled={loading || !accountId}
            onClick={refresh}
          >
            {loading ? "Loading account…" : "Refresh"}
          </button>
          <button
            className="btn btn-sm"
            disabled={!ready}
            onClick={() => setShowDep(true)}
          >
            Record deposit
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setActiveTab("activity")}
          >
            Transaction activity
          </button>
        </div>
        {!accountId && (
          <p role="alert" className="p-10">
            Select an account from the accounts page.
          </p>
        )}
        {Object.keys(errors).length > 0 && (
          <div role="alert" className="p-6 bg-red-50 text-red-800">
            {Object.entries(errors).map(([key, message]) => (
              <p key={key}>
                {key}: {message}
              </p>
            ))}
            <button className="underline" onClick={refresh}>
              Retry loading
            </button>
          </div>
        )}
        {account && !account.bamboo_user_id && (
          <AccountLink account={account} onLinked={refresh} />
        )}
        {account?.bamboo_status === "pending" && (
          <p className="px-10 py-4 bg-blue-50">
            Brokerage activation is pending. Refresh to check its status.
          </p>
        )}
        {activeTab === "activity" && (
          <Operations
            accountId={accountId}
            operations={operations}
            onUpdated={refresh}
            nextPage={operationNext}
            loadMore={() => loadMore("operations")}
          />
        )}

        <div className="grid space-y-10">
          <div
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 40' width='80' height='40'%3E%3Cpath fill='%23ffffff' fill-opacity='0.05' d='M0 40a19.96 19.96 0 0 1 5.9-14.11 20.17 20.17 0 0 1 19.44-5.2A20 20 0 0 1 20.2 40H0zM65.32.75A20.02 20.02 0 0 1 40.8 25.26 20.02 20.02 0 0 1 65.32.76zM.07 0h20.1l-.08.07A20.02 20.02 0 0 1 .75 5.25 20.08 20.08 0 0 1 .07 0zm1.94 40h2.53l4.26-4.24v-9.78A17.96 17.96 0 0 0 2 40zm5.38 0h9.8a17.98 17.98 0 0 0 6.67-16.42L7.4 40zm3.43-15.42v9.17l11.62-11.59c-3.97-.5-8.08.3-11.62 2.42zm32.86-.78A18 18 0 0 0 63.85 3.63L43.68 23.8zm7.2-19.17v9.15L62.43 2.22c-3.96-.5-8.05.3-11.57 2.4zm-3.49 2.72c-4.1 4.1-5.81 9.69-5.13 15.03l6.61-6.6V6.02c-.51.41-1 .85-1.48 1.33zM17.18 0H7.42L3.64 3.78A18 18 0 0 0 17.18 0zM2.08 0c-.01.8.04 1.58.14 2.37L4.59 0H2.07z'%3E%3C/path%3E%3C/svg%3E")`,
            }}
            className="grid h-60 space-y-10 py-10 bg-[#2D7EC2] lg:px-20 px-10 text-white"
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
                  <div>accounts</div>
                </button>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2">
                <div className="space-y-1 self-center">
                  <div className="text-4xl font-ibm">
                    {currVal(portTwo?.value ?? portOne?.value ?? null)}
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

          <div className="grid grid-cols-2 lg:pt-10 px-10 lg:px-20">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  total invested
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.total_invested ?? null)}
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
                        className="w-6 h-6 rotate-45"
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
                    {portTwo?.total_percent_change == null
                      ? "—"
                      : `${portTwo.total_percent_change}%`}
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
                  {currVal(portTwo?.total_return ?? null)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  equity value
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.equity_value ?? null)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  available to invest
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.available_to_invest ?? null)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  pending deposit
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portOne?.pending_deposit ?? null)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  usd to ngn
                </div>
                <div className="text-2xl font-ibm text-gray-400 font-medium">
                  {currVal(portOne?.usd_to_naira ?? null)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  withdrawable
                </div>
                <div className="text-2xl font-ibm font-medium">
                  {currVal(portTwo?.withdrawable_cash ?? null)}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 place-self-start justify-self-end">
              <button
                disabled={!ready}
                onClick={() => setShowTr(true)}
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
                disabled={!ready}
                onClick={() => setShowWd(true)}
                type="button"
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

        {/** Select active stocks, pending orders, or withdrawals. */}
        <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:px-20 md:px-10 px-0 pt-16">
          <div
            onClick={() => setActiveTab("stocks")}
            className={`${
              activeTab === "stocks" && `bg-gray-800 text-white`
            } flex cursor-pointer items-center justify-between md:rounded-tl-2xl border-t border-r border-l bg-gray-50 py-4 px-7 pt-5`}
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
            onClick={() => setActiveTab("orders")}
            className={`${
              activeTab === "orders" && `bg-gray-800 text-white`
            } flex cursor-pointer items-center justify-between border-t border-r border-l bg-gray-50 py-4 px-7 pt-5`}
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

          <div
            onClick={() => setActiveTab("withdrawals")}
            className={`${
              activeTab === "withdrawals" && `bg-gray-800 text-white`
            } flex cursor-pointer items-center justify-between md:rounded-tr-2xl border-t border-r border-l bg-gray-50 py-4 px-7 pt-5`}
          >
            <div className="flex items-center space-x-2 text-xs font-bold uppercase">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-6 w-6 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>

              <div>withdrawals</div>
            </div>

            <div className="font-ibm text-xl font-normal text-blue-400">
              {withdrawals.length}
            </div>
          </div>
        </div>

        {activeTab === "stocks" &&
          (stocks.length > 0 ? (
            stocks.map((s) => (
              <StockInfo
                key={s?.symbol}
                bg={s?.background_color}
                name={s?.name}
                symbol={s?.symbol}
                perc_change={rounded(s?.percent_change)}
                price={rounded(s?.price)}
                quantity={rounded(s?.quantity, 8)}
                total_return={rounded(s?.total_return)}
                value_change={rounded(s?.value_change)}
                equity={rounded(s?.user_equity)}
                logo={s?.logo}
                s_data={s}
              />
            ))
          ) : (
            <div className="grid place-items-center border-t text-gray-400 uppercase text-xs font-medium tracking-wide py-12">
              <div>
                {loading
                  ? "Loading holdings…"
                  : errors.stocks
                  ? "Holdings could not be loaded."
                  : "No stocks yet."}
              </div>
            </div>
          ))}

        {activeTab === "orders" && (
          <div>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((p) => (
                <PendingOrder
                  key={p?.symbol}
                  name={p?.name}
                  symbol={p?.symbol}
                  status={p?.status}
                  side={p?.side}
                  fee={rounded(p?.fee)}
                  pps={rounded(p?.price_per_share)}
                  price={rounded(p?.order_price)}
                  quantity={rounded(p?.quantity, 8)}
                  logo={p?.logo}
                />
              ))
            ) : (
              <div className="grid place-items-center border-t text-gray-400 uppercase text-xs font-medium tracking-wide py-12">
                <div>
                  {loading
                    ? "Loading orders…"
                    : errors.pendingOrders
                    ? "Orders could not be loaded."
                    : "No pending orders."}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "withdrawals" && (
          <div>
            {withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <WithdrawalItem
                  key={w?.reference ?? w?.id}
                  amount={w?.amount}
                  dollar_amount={w?.dollar_amount}
                  currency={w?.currency}
                  status={w?.status}
                  reference={w?.reference}
                  bank_name={w?.bank_name}
                  account_number={w?.account_number}
                  created_at={w?.created_at}
                  fees={w?.fees ?? w?.dollar_fees}
                />
              ))
            ) : (
              <div className="grid place-items-center border-t text-gray-400 uppercase text-xs font-medium tracking-wide py-12">
                <div>
                  {loading
                    ? "Loading withdrawals…"
                    : errors.withdrawals
                    ? "Withdrawals could not be loaded."
                    : "No withdrawals yet."}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs py-20 lg:px-20 px-10">
          <div className="self-center flex items-center justify-between text-xs">
            <div>&copy; 2022 - {new Date().getFullYear()} WPEA Labs</div>
          </div>
        </div>
      </div>

      {/* <>
        {showDep && <Deposit accountId={accountId} showDep={showDep} toggleAdd={() => setShowDep(false)} onSuccess={refresh} />}
      </> */}

      <>
        {showTr && (
          <Trade
            accountId={accountId}
            account={account}
            showDep={showTr}
            toggleAdd={() => setShowTr(false)}
            onSuccess={refresh}
          />
        )}
      </>

      <>
        {showWd && (
          <Withdraw
            accountId={accountId}
            showDep={showWd}
            toggleAdd={() => setShowWd(false)}
            onSuccess={refresh}
          />
        )}
      </>
      {activeTab === "withdrawals" && withdrawalNext !== null && (
        <button className="btn m-6" onClick={() => loadMore("withdrawals")}>
          Load more withdrawals
        </button>
      )}
    </AppLayout>
  );
}

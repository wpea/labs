// import EditButton from "@/app/fundmanager/[id]/EditTransaction";

import React from "react";
import Buttons from "./AddTransaction";
import EditButton from "./EditTransaction";
import Link from "next/link";
import LiquidateButton from "./Liquidate";

const Table = ({ transactions }) => {
  const formatCompact = (number) => {
    const formatter = new Intl.NumberFormat("en", {
      notation: "standard",
    });
    return formatter.format(number);
  };

  const daysLeft = (maturityDate) => {
    const currentDate = new Date();
    const targetDate = new Date(maturityDate);

    const difference = targetDate - currentDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (difference < 0) {
      return "Matured";
    }

    return days;
  };

  const getDate = (input) => {
    const date = new Date(input);

    return date.toDateString();
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg px-16 pb-16">
      <div className="p-6 rounded-lg bg-opacity-50 bg-gray-100">
        <table className="w-full text-sm text-left">
          <caption className="p-5 font-semibold text-left">
            {/* <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            This is a list of all the events that have occured with this "fund
            manager"
          </p> */}
            <div className=" flex items-center justify-between">
              <div className="font-bold">All Transactions</div>
              <div>
                <Buttons />
              </div>
              {/* <Button
              className="flex items-end bg-[#2D7EC2] text-white"
              onClick={clickMe}
            >
              Add Transaction
            </Button> */}
            </div>
          </caption>
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Investment Date
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Rate (%)
              </th>
              <th scope="col" className="px-6 py-3">
                Maturity Date
              </th>
              <th scope="col" className="px-6 py-3">
                Tenor
              </th>

              {/* <th scope="col" className="px-6 py-3">
                <span className="">Actions</span>
              </th> */}
            </tr>
          </thead>
          <tbody className="">
            {transactions?.map((transaction) => {
              return (
                // eslint-disable-next-line react/jsx-key, @next/next/link-passhref
                <>
                  <Link
                    href={`/asset-allocation/transactions/${transaction._id}`}
                    className=""
                  >
                    <tr
                      className="border-b border-gray-200 hover:bg-gray-100 hover:cursor-pointer"
                      key={transaction._id}
                    >
                      <td className="px-6 py-4 ">
                        {getDate(transaction.date)}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap"
                      >
                        {formatCompact(transaction.amount)}
                      </td>

                      <td className="px-6 py-4 ">{transaction.description}</td>
                      <td className="px-6 py-4 ">{transaction.rate}</td>
                      <td className="px-6 py-4 ">
                        {getDate(transaction.maturityDate)}
                      </td>
                      <td className="px-6 py-4 ">{transaction.tenure}</td>

                      {/* <td className="px-6 py-4 flex">
                        <EditButton
                          previousInfo={transaction}
                          transactionId={transaction._id}
                        />
                        <LiquidateButton
                          previousInfo={transaction}
                          transactionId={transaction._id}
                        />
                      </td> */}
                    </tr>
                  </Link>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

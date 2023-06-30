// import EditButton from "@/app/fundmanager/[id]/EditTransaction";

import React from "react";
import Buttons from "./AddTransaction";
import EditButton from "./EditTransaction";
// import { Button, Checkbox, Label, TextInput, Textarea } from "flowbite-react";

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
    console.log(date.toDateString());
    return date.toDateString();
  };

  console.log(transactions);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#F4F5F6] p-16 ">
      <table className="w-full text-sm text-left  dark:text-gray-400 ">
        <caption className="p-5 font-semibold text-left   dark:text-white ">
          {/* <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            This is a list of all the events that have occured with this "fund
            manager"
          </p> */}
          <div className=" flex items-center justify-between">
            <p>Transactions</p>
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
        <thead className="text-xs text-gray-500 uppercase   dark:text-gray-400">
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
              Days till Maturity
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        {transactions?.map((transaction) => {
          return (
            <tbody key={transaction._id}>
              <tr className=" border-b  border-gray-700">
                <td className="px-6 py-4 ">{getDate(transaction.date)}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white"
                >
                  {formatCompact(transaction.amount)}
                </th>

                <td className="px-6 py-4 ">{transaction.description}</td>
                <td className="px-6 py-4 ">{transaction.rate}%</td>
                <td className="px-6 py-4 ">
                  {getDate(transaction.maturityDate)}
                </td>
                <td className="px-6 py-4 ">
                  {daysLeft(transaction.maturityDate) === "Matured" ? (
                    <span className="bg-red-100 text-red-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-red-400">
                      <svg
                        aria-hidden="true"
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Matured
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                      <svg
                        aria-hidden="true"
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {daysLeft(transaction.maturityDate)}
                      {" days left "}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 ">
                  <EditButton
                    previousInfo={transaction}
                    transactionId={transaction._id}
                  />
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default Table;

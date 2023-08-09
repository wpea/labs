import React from "react";
import CreateRolloverButton from "./AddRollover";

const RolloverTable = ({ transactions }) => {
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

  console.log(transactions);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#F4F5F6] p-6">
      <table className="w-full text-sm text-left">
        <caption className="p-5 font-semibold text-left">
          {/* <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            This is a list of all the events that have occured with this "fund
            manager"
          </p> */}
          <div className=" flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-2xl">History</p>
              <p className="font-light">May include data for this Investment</p>
            </div>

            <div>
              {/* <Buttons /> */}
              <CreateRolloverButton />
            </div>
            {/* <Button
              className="flex items-end bg-[#2D7EC2] text-white"
              onClick={clickMe}
            >
              Add Transaction
            </Button> */}
          </div>
        </caption>
        {transactions.length > 1 && (
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Investment Date
              </th>

              <th scope="col" className="px-6 py-3">
                Rate (%)
              </th>
              <th scope="col" className="px-6 py-3">
                Maturity Date
              </th>

              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
        )}

        {transactions.length < 1 ? (
          <span className="bg-red-100 text-red-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2">
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
            No Rollovers on this Investment yet
          </span>
        ) : null}
        {transactions?.map((transaction) => {
          return (
            <tbody key={transaction._id}>
              <tr className=" border-b border-gray-200">
                <td className="px-6 py-4">{getDate(transaction.date)}</td>

                <td className="px-6 py-4">{transaction.rate}%</td>
                <td className="px-6 py-4">
                  {getDate(transaction.maturityDate)}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default RolloverTable;

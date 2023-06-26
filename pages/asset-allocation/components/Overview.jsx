import React from "react";
import { PieChart } from "./Pie";

const formatCompact = (number) => {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
  });
  return formatter.format(number);
};

const formatTotalCap = (number) => {
  const result = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
  }).format(`${number}`);
  console.log(result);
  return result;
};

const Overview = ({ totalAssetManagers, totalCap, topFive }) => {
  return (
    <div>
      <h1 className="mb-8 font-bold text-4xl">Overview</h1>
      <div className="bg-[#F4F5F6] h-auto rounded p-12">
        <div className="overview flex gap-12">
          <div className="flex flex-col ">
            <p className="text-gray-700">Fund Managers</p>
            <h2 className="text-6xl font-semibold">{totalAssetManagers}</h2>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-700">Total Cap</p>
            <h2 className="text-6xl font-semibold">
              {formatTotalCap(totalCap)}
            </h2>
          </div>
        </div>

        {/* Exposure */}
        <div className="my-12">
          <div className="flex items-center justify-between border-b pb-4">
            <p className="">Exposure</p>
            <div className="flex  items-center gap-36 justify-between">
              <p>Top 5 by allocation size</p>
              <span className="flex gap-9">
                <div
                  data-tooltip-target="tooltip-default"
                  className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full "
                >
                  <span className="font-medium text-white ">?</span>
                  <div
                    id="tooltip-default"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                  >
                    Tooltip content
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full ">
                  <span className="font-medium text-white ">?</span>
                </div>
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full ">
                  <span className="font-medium text-white ">?</span>
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Pie Chart & Legend */}
        <div className="flex items-center justify-between">
          <div className=" h-96  mx-auto">
            <PieChart datum={topFive} />
          </div>
          <div className=" h-96 w-1/2 flex flex-col items-end  ">
            {topFive?.map((top) => {
              return (
                <div
                  className="flex justify-between  text-right   border-b py-4  gap-36 items-center  "
                  key={top.name}
                >
                  <p className="">{top.name}</p>
                  <div className="flex items-center justify-between gap-12 text-right">
                    <p className="w-12 ">{formatCompact(top.total)}</p>
                    <p className="w-12 ">
                      {Math.ceil((parseFloat(top.total) / totalCap) * 100)}%
                      {/* 100% */}
                    </p>
                    {Math.ceil((parseFloat(top.total) / totalCap) * 100) >
                    50 ? (
                      <p className="h-3 w-3 rounded-full bg-red-500"></p>
                    ) : (
                      <p className="h-3 w-3 rounded-full bg-green-500"></p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

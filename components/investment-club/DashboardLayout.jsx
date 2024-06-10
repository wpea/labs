import React from "react";
import { Sidebar } from "./Sidebar";
import Header from "../header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="md:px-20 p-10 border-b-[0.5px] space-y-10 grid ">
        <Header />
      </div>
      <div className="px-56 pt-7">
        <div className="flex justify-between">
          <button className="w-8 h-8 mb-14">
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="17.5"
                cy="17.5"
                r="16.5"
                stroke="black"
                strokeWidth="1.5"
              />
              <path
                d="M10.9 17.5L24.1 17.5M10.9 17.5C10.9 16.3446 14.1906 14.186 15.025 13.375M10.9 17.5C10.9 18.6554 14.1906 20.814 15.025 21.625"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="py-2 px-3 mb-14 bg-[#55B246] flex items-center rounded-md">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 7.5C14 3.91015 11.0899 1 7.5 1C3.91015 1 1 3.91015 1 7.5C1 11.0899 3.91015 14 7.5 14C11.0899 14 14 11.0899 14 7.5Z"
                stroke="white"
              />
              <path
                d="M8.06148 4.71936L8.63342 5.87268C8.71141 6.03323 8.91939 6.18723 9.09487 6.21672L10.1315 6.39037C10.7944 6.50177 10.9504 6.98669 10.4727 7.46506L9.6668 8.27763C9.53032 8.41524 9.45558 8.68064 9.49782 8.87068L9.72855 9.87656C9.91053 10.6727 9.49132 10.9807 8.79265 10.5646L7.82101 9.98469C7.64553 9.87984 7.35631 9.87984 7.17758 9.98469L6.20594 10.5646C5.51051 10.9807 5.08806 10.6695 5.27004 9.87656L5.50076 8.87068C5.54301 8.68064 5.46827 8.41524 5.33178 8.27763L4.52587 7.46506C4.05142 6.98669 4.20416 6.50177 4.86708 6.39037L5.90372 6.21672C6.07595 6.18723 6.28393 6.03323 6.36192 5.87268L6.93386 4.71936C7.24582 4.09355 7.75277 4.09355 8.06148 4.71936Z"
                fill="white"
              />
            </svg>
            <p className="text-white">The Umm Fariha Network</p>
          </button>
        </div>
        <div className="flex gap-x-11">
          <Sidebar />
          <main className="h-full w-full overflow-y-auto flex-grow ">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

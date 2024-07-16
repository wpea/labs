import React from "react";
import DashboardLayout from "../../../../../components/investment-club/DashboardLayout";
import { Tab } from "@headlessui/react";

import { Badge } from "../../../../../components/investment-club/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/investment-club/Table";

const tableData = [
  {
    name: "John Doe",
    age: 35,
    investmentStyle: "Aggressive",
    investibleCash: "$50,000",
    riskTolerance: "High",
    investorType: "Individual",
  },
  {
    name: "Jane Smith",
    age: 40,
    investmentStyle: "Moderate",
    investibleCash: "$100,000",
    riskTolerance: "Medium",
    investorType: "Corporate",
  },
  // Add more data as needed
];

const index = () => {
  return (
    <DashboardLayout>
      <h1 className="text-[#2D2D2D] text-2xl font-semibold mb-8">Overview</h1>
      <div className="flex items-center justify-between">
        <div className="bg-[#2D2D2D] p-5 flex  flex-col gap-y-11 rounded-lg w-[207px] h-full">
          <h2 className="text-sm  font-bold text-[#F6F8FC]">
            Current Club Value
          </h2>
          <div>
            <p className="text-2xl font-semibold text-[#F6F8FC]">$0.00</p>
            <p className="text-[10px] text-[#F6F8FC]">as at July 12th, 2024</p>
          </div>
        </div>

        <div className="bg-white flex flex-col  rounded-lg w-[207px] h-fit">
          <h2 className="text-sm  font-bold  p-4 border-b-[0.5px]">Members</h2>

          <div className="flex border-b-[0.5px] items-center p-4 justify-between">
            <p className="text-[10px]  ">Registered</p>
            <p className=" text-[#DC9936]">0</p>
          </div>

          <div className="flex border-b-[0.5px] items-center p-4 justify-between">
            <p className="text-[10px]  ">Approved</p>
            <p className=" text-[#DC9936]">0</p>
          </div>
        </div>

        <div className="bg-white flex flex-col justify-between  rounded-lg w-[207px] h-fit">
          <h2 className="text-sm  font-bold  p-4 border-b-[0.5px]">Units</h2>

          <div className="flex border-b-[0.5px] items-center p-4 justify-between">
            <p className="text-[10px]  ">Purchased</p>
            <p className="  text-xl">0</p>
          </div>

          <div className="flex border-b-[0.5px] items-center p-4  justify-between">
            <p className="text-[10px]  ">Value</p>
            <p className=" text-base font-semibold">$0.00</p>
          </div>
        </div>
      </div>
      <TableDiv />
    </DashboardLayout>
  );
};

export default index;

const TableDiv = () => {
  return (
    <div className="h-[320px] w-full mt-14 ">
      <div className="flex justify-between items-center">
        <button className="bg-white font-semibold text-[10px] flex items-center gap-x-1 py-1 px-2 rounded-md">
          <svg
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.88908 7.22266C8.11384 7.44112 9.00021 8.02257 9.00021 8.33379M7.88908 9.44493C8.11384 9.22647 9.00021 8.64501 9.00021 8.33379M9.00021 8.33379L5.44457 8.33379"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.55566 9.88867H4.43444C2.98498 9.88867 2.26025 9.88867 1.75695 9.53407C1.61275 9.43247 1.48473 9.31198 1.37678 9.17626C1.00002 8.70257 1.00002 8.02047 1.00002 6.65627V5.52493C1.00002 4.20793 1.00002 3.54943 1.20844 3.0235C1.5435 2.178 2.25211 1.51108 3.15045 1.19573C3.70925 0.999566 4.4089 0.999566 5.80821 0.999566C6.60782 0.999566 7.00762 0.999566 7.32694 1.11166C7.84028 1.29186 8.24519 1.67296 8.43666 2.1561C8.55576 2.45663 8.55576 2.83292 8.55576 3.58549V5.88857"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0.999997 5.44531C0.999997 4.62709 1.66329 3.96379 2.48151 3.96379C2.77743 3.96379 3.12629 4.01564 3.414 3.93855C3.66963 3.87006 3.8693 3.67039 3.93779 3.41476C4.01488 3.12705 3.96303 2.77819 3.96303 2.48228C3.96303 1.66406 4.62633 1.00076 5.44455 1.00076"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Export to CSV
        </button>
        <div className=" bg-white rounded-md gap-x-2 flex items-center px-[10px]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7525 11.2475C10.8892 11.3842 11.1108 11.3842 11.2475 11.2475C11.3842 11.1108 11.3842 10.8892 11.2475 10.7525L10.7525 11.2475ZM8.75251 9.24749L10.7525 11.2475L11.2475 10.7525L9.24749 8.75251L8.75251 9.24749ZM10.35 5.5C10.35 2.82142 8.17858 0.65 5.5 0.65V1.35C7.79198 1.35 9.65 3.20802 9.65 5.5H10.35ZM5.5 0.65C2.82142 0.65 0.65 2.82142 0.65 5.5H1.35C1.35 3.20802 3.20802 1.35 5.5 1.35V0.65ZM0.65 5.5C0.65 8.17858 2.82142 10.35 5.5 10.35V9.65C3.20802 9.65 1.35 7.79198 1.35 5.5H0.65ZM5.5 10.35C8.17858 10.35 10.35 8.17858 10.35 5.5H9.65C9.65 7.79198 7.79198 9.65 5.5 9.65V10.35Z"
              fill="black"
            />
          </svg>

          <input
            type="text"
            className="bg-white border-none active:border-none"
          />
        </div>
      </div>
      {/* Actual Table */}
      <div className="bg-white rounded-md mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Investment Style</TableHead>
              <TableHead>Investable Cash</TableHead>
              <TableHead>Risk tolerance</TableHead>
              <TableHead>Investor Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Abigail Trujillo
                <Badge variant="approved">Approved</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>
                Passive Preserver
                {/* <CheckIcon className="text-green-500" /> */}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Raheemah Odusote
                <Badge variant="pending">Pending</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>Passive Preserver</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Tasleem Umar
                <Badge variant="approved">Approved</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>
                Passive Preserver
                {/* <CheckIcon className="text-green-500" /> */}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Tasleem Umar
                <Badge variant="approved">Approved</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>
                Passive Preserver
                {/* <CheckIcon className="text-green-500" /> */}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Tasleem Umar
                <Badge variant="approved">Approved</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>
                Passive Preserver
                {/* <CheckIcon className="text-green-500" /> */}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Tasleem Umar
                <Badge variant="approved">Approved</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>
                Passive Preserver
                {/* <CheckIcon className="text-green-500" /> */}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Tasleem Umar
                <Badge variant="approved">Approved</Badge>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>Conservative</TableCell>
              <TableCell>$1,000.00</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>
                Passive Preserver
                {/* <CheckIcon className="text-green-500" /> */}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between mt-4">
        {/* <Button variant="ghost">Prev</Button>
        <Button variant="ghost">Next</Button> */}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";

import KYC from "./kyc/[id]";
import DashboardLayout from "../../../../../components/investment-club/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/investment-club/Table";
import { Badge } from "../../../../../components/investment-club/Badge";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { getToken } from "../../../../../lib/hooks/useAuth2";
import toast from "react-hot-toast";

const Transactions = () => {
  const router = useRouter();
  const { uniqueClubId } = router.query;
  const [transactions, setTransactions] = useState([]);

  const getAllTransactions = async () => {
    try {
      const res = await axios.get(
        `https://client.wealthparadigm.org/api/labs/clubs/transactions/${uniqueClubId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(res.data);
      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveTransaction = async (transactionId) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/labs/clubs/transaction/approve/${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log(res.data);
      toast.success("Transaction approved successfully.");
      getAllTransactions(); // Refresh the transaction list after approval
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Error approving transaction");
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [uniqueClubId]);

  return (
    <DashboardLayout>
      <h1 className="text-[#2D2D2D] text-2xl font-semibold">Transactions</h1>

      <TableDiv
        data={transactions}
        uniqueClubId={uniqueClubId}
        approveTransaction={approveTransaction}
      />
      {/* <KYC /> */}
    </DashboardLayout>
  );
};

export default Transactions;

const TableDiv = ({ uniqueClubId, data, approveTransaction }) => {
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
              <TableHead>Email</TableHead>
              <TableHead></TableHead>
              <TableHead>Amount (USD)</TableHead>
              <TableHead>Amount (NGN)</TableHead>
              <TableHead>Transaction Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="5.5"
                    stroke="#141B34"
                    strokeWidth="0.825"
                  />
                  <path
                    d="M6.49562 8.14844H6.50056"
                    stroke="#141B34"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 6.5L6.5 4.3"
                    stroke="#141B34"
                    strokeWidth="0.825"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.user_details.first_name}{" "}
                    {transaction.user_details.last_name}
                  </TableCell>
                  <TableCell>{transaction.user_details.email}</TableCell>
                  <TableCell>
                    {" "}
                    <Link
                      passHref
                      href={`/investment-clubs/${uniqueClubId}/dashboard/transactions/kyc/${transaction.user_id}`}
                    >
                      <button>
                        <Badge variant="approved">KYC</Badge>
                      </button>
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.amount * 1500}</TableCell>
                  <TableCell>{transaction.created_at}</TableCell>
                  <TableCell>
                    {transaction.status === false ? (
                      <Badge variant="pending">Pending</Badge>
                    ) : (
                      <Badge variant="approved">Approved</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!transaction.status && (
                      <button
                        onClick={() => {
                          approveTransaction(transaction.id);
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C11.6421 15 15 11.6421 15 7.5Z"
                            fill="#55B346"
                          />
                          <path
                            d="M4.5 7.875L6.375 9.75L10.5 5.25"
                            stroke="#F6F8FC"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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

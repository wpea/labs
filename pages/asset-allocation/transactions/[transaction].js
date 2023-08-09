/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import axios from "axios";

import RolloverTable from "../../../components/asset-allocation/RolloverTable";
import { useRouter, useParams } from "next/router";
import { ASSETMANAGERS } from "../../../lib/api";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  //   const params = useParams();
  const router = useRouter();
  const { transaction } = router.query;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rollovers, setRollovers] = useState([]);
  //   console.log(router.query);

  useEffect(() => {
    const getRolloversOnTransactions = async () => {
      try {
        console.log(transaction);
        const result = await axios.get(
          `${ASSETMANAGERS}/rollover/${transaction}`
        );

        setRollovers(result.data.data);
        console.log("qwerty", result.data.data);
      } catch (error) {
        console.log("get Rollover on Transaction error:", error);
      }
    };
    getRolloversOnTransactions();
  }, [transaction]);

  return (
    <div className="h-screen p-20">
      <div></div>
      {/* <Table transactions={response.data.data.transaction} /> */}
      <button
        className="flex gap-2 border rounded-lg px-4 shadow-md hover:opacity-80 py-2 mb-16"
        type="button"
        onClick={() => router.back()}
      >
        <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            <p>Back</p>
      </button>
      <RolloverTable transactions={rollovers} />
    </div>
  );
};

export default index;

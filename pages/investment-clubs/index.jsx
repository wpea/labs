import React, { useEffect, useState } from "react";

import AppLayout from "../../components/Layouts/AppLayout";
import Header from "../../components/header";
// import Layout from "../../components/investment-club/layout";
import Link from "next/link";
import axios from "axios";
import { getToken } from "../../lib/hooks/useAuth2";
import { useRouter } from "next/router";

const Index = () => {
  const [clubs, setClubs] = useState([]);

  const getClubs = async () => {
    try {
      const res = await axios.get(
        "https://client.wealthparadigm.org/api/labs/clubs",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log(res.data);
      setClubs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <AppLayout>
      <div className="mx-20 mt-12">
        <Header />
        {/* <Layout> */}
        <div className="flex justify-end items-end">
          <Link href={"/investment-clubs/create"} passHref>
            <button className="text-white text-sm bg-[#2D2D2D] rounded-md items-center flex gap-x-2 p-3">
              <p>New Investment Club </p>

              <span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 1V13M13 7H1"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </Link>
        </div>
        {/* <div className="mx-auto flex justify-center items-center h-[80vh]">
          <div className="text-center text-[#1E1E1E33] ">
            Create an investment club.
          </div>
        </div> */}
        {/* <Layout> */}
          {clubs.map((club) => (
            <InvestmentClub
              key={club.id}
              name={club.name}
              id={club.unique_id}
              unitCap={club.unit_cap}
            />
          ))}
        {/* </Layout> */}

        {/* </Layout> */}
      </div>
    </AppLayout>
  );
};

export default Index;

const InvestmentClub = ({ name, unitCap, id }) => {
  console.log(name);
  const stringWithoutWhitespace = name.replace(/\s+/g, "");

  return (
    <Link href={`/investment-clubs/${id}`}>
      <div className="w-[302px] cursor-pointer h-[155px] bg-[#2D2D2D] rounded-lg m-12">
        <div className="h-[104px] border-b-[0.2px] flex items-center px-7">
          <p className="text-white text-2xl">{name}</p>
        </div>
        <div className="flex items-center h-[51px] justify-between px-7">
          <div className="flex gap-x-2 items-center text-white">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.98754 8.49009C2.20156 8.9581 0.140758 9.91372 1.39592 11.1095C2.00906 11.6937 2.69194 12.1114 3.55048 12.1114H8.44952C9.30806 12.1114 9.99094 11.6937 10.6041 11.1095C11.8592 9.91372 9.79844 8.9581 9.01246 8.49009C7.16934 7.39262 4.83066 7.39262 2.98754 8.49009Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 3.5C8.5 4.88071 7.38071 6 6 6C4.61929 6 3.5 4.88071 3.5 3.5C3.5 2.11929 4.61929 1 6 1C7.38071 1 8.5 2.11929 8.5 3.5Z"
                stroke="white"
              />
            </svg>
            12
          </div>
          <div className="flex gap-x-2 items-center text-white">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.79997 11.4C11.6719 11.4 14 9.07188 14 6.2C14 3.32812 11.6719 1 8.79997 1C5.92809 1 3.59998 3.32812 3.59998 6.2C3.59998 9.07188 5.92809 11.4 8.79997 11.4Z"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M8.25851 13.3295C7.54098 13.7553 6.70322 13.9997 5.80838 13.9997C3.15278 13.9997 1 11.8469 1 9.19135C1 8.2965 1.24444 7.45874 1.6702 6.74121"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            ${unitCap}
          </div>
        </div>
      </div>
    </Link>
  );
};

import AppLayout from "./../../../../../components/Layouts/AppLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiAddress } from "../../../../../lib/api";
import axios from "axios";
import Allocate from './../../../../../components/Stocks/Allocate';
import { toast } from 'react-hot-toast';

export default function Stock() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [alloc, setAlloc] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    !Object.keys(router.query).length &&
      router.push("/stocks/dashboard/account");

    setData(router.query);

    /**
     * Get allocated data
     */
    getAllocatedData(router.query.symbol);
  }, [modal]);

  const getAllocatedData = async (symbol) => {
    try {
      const res = await axios.get(
        `${apiAddress}/stock/allocation/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      setAlloc(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };


  const deleteAlloc = async (id) => {
    console.log(id);
    try {
      await axios.delete(`${apiAddress}/stock/allocation/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
        }
      });
      toast.success('Allocation deleted.');
      getAllocatedData(data?.symbol);
    } catch(e) {
      console.log(e)
      toast.error('An error occured.');
    }
  }


  return (
    <>
      <AppLayout>
        <div className="grid w-full">
          <div className="grid">
            <div className="grid h-60 space-y-10 bg-[#2D7EC2] py-10 px-20 text-white">
              <div className="grid grid-cols-2 self-start">
                <div className="self-center font-bold">
                  <svg
                    onClick={() => router.push("/stocks/dashboard/account")}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer hover:opacity-80"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </div>
                <div className="space-y-3 self-center">
                  <div className="text-right text-xs">
                    Innovating the family office.
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-20 -mt-28 min-h-screen space-y-12 rounded-t-3xl bg-white py-10 shadow-lg md:px-10">
              <div className="grid grid-cols-2">
                <div className="grid grid-cols-4">
                  <div className="space-y-3">
                    <div
                      style={{
                        backgroundColor: `#` + data?.background_color,
                      }}
                      className={`grid h-16 w-16 place-items-center self-center rounded-full`}
                    >
                      <img
                        className="w-8"
                        src={data?.logo}
                        alt="Alteryx Inc - className A"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">
                      {data?.symbol}
                    </div>
                    <div className="font-ibm text-2xl font-medium">
                      {data?.name}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">
                      total return ($)
                    </div>
                    <div className="font-ibm text-2xl font-medium">
                      {data?.total_return}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">
                      total percent change
                    </div>
                    <div className="font-ibm text-2xl font-medium">
                      {data?.total_percent_change}%
                    </div>
                  </div>
                </div>

                {/* <div>{JSON.stringify(data)}</div> */}

                <div className="flex space-x-4 place-self-start justify-self-end">
                  <button
                    onClick={() => setModal(!modal)}
                    className="btn flex w-36 justify-between place-self-end border-none bg-gray-700 capitalize hover:bg-gray-900"
                  >
                    <div>allocate</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="grid grid-cols-4">
                  <div></div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">
                      quantity
                    </div>
                    <div className="font-ibm text-2xl font-medium">
                      {parseInt(data?.quantity).toFixed(3)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">
                      equity value
                    </div>
                    <div className="font-ibm text-2xl font-medium">
                      {parseInt(data?.user_equity).toFixed(3)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">
                      market price
                    </div>
                    <div className="font-ibm text-2xl font-medium">
                      {data?.market_price}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto pt-14 space-y-3">
                <div className="flex">
                  <div className="text-wp-blue rounded-xl bg-gray-100 px-4 py-2 font-bold">
                    Allocations
                  </div>
                </div>

                {!alloc.length ? (
                  <div className="grid place-items-center">
                    <div className="px-4 py-2 text-gray-400">No allocations.</div>
                  </div>
                ) : (
                  <table className="table w-full">
                    {/* <!-- head --> */}
                    <thead>
                      <tr>
                        <th className="rounded-none bg-stone-200 bg-opacity-70 text-[10px] uppercase tracking-widest text-gray-500">
                          Name
                        </th>
                        <th className="text-[10px] uppercase tracking-widest text-gray-500">
                          Percentage (%)
                        </th>
                        <th className="text-[10px] uppercase tracking-widest text-gray-500">
                          total cap at purchase ($)
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <!-- row 1 --> */}
                      {alloc?.map((a) => (
                        <tr key={a?.id}>
                          <td>
                            {a?.name}
                            <div className="flex">
                              <div className="my-1.5 rounded-full border bg-gray-600 px-2 text-[10px] text-white">
                                {a?.created_at}
                              </div>
                            </div>
                          </td>
                          <td>{a?.percentage}</td>
                          <td>{a?.total_cap}</td>
                          <td>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => deleteAlloc(a?.id)}
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6 cursor-pointer text-red-600 hover:opacity-70"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>

      <Allocate show={modal} stockValues={data} toggle={() => setModal(!modal)} />
    </>
  );
}

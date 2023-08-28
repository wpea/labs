import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import CurrencyInput from "react-currency-input-field";
import { config } from "../../lib/adapter";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spin from "../Misc/Spin";
import { useRouter } from "next/router";
import { apiAddress, bambooLive } from "../../lib/api";

export default function Withdraw({ showDep, toggleAdd }) {
  const router = useRouter();
  const [addAcc, setAddAcc] = useState(false);
  const [userBanks, setUserBanks] = useState([]);
  // const [banks, setBanks] = useState([]);
  const [wData, setWData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [fBank, setFBank] = useState({});
  const [verify, setVerify] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bank_id: "",
    currency: "",
    nuban: "",
  });
  const [sData, setSData] = useState({
    amount: "",
    account_id: "",
  });
  const [aError, setAError] = useState(false);
  const [cError, setCError] = useState(false);
  const [bError, setBError] = useState(false);
  // const [wData, setWData] = useState({

  // })

  useEffect(() => {
    getWithdrawMethods();
    getUserBanks();
  }, []);

  /**
   * CONFIG
   */
  const config2 = (method, url, jwt) => {
    return {
      method: method,
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: {
        jwt: jwt,
      },
    };
  };

  /**
   *
   * GET WDWL METHODS
   *
   */
  const getWithdrawMethods = async () => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await axios(
        config2("post", `${apiAddress}/stock/withdraw/methods`, user.jwt)
      );

      setWData(res.data.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  /**
   *
   * STORE
   * ACCOUNT
   * NUMBER
   *
   */
  const handleAddAccount = async (e) => {
    e.preventDefault();

    // verify data
    if (!bankInfo.bank_id) {
      return setBError(true);
    } else {
      setBError(false);
    }

    if (!bankInfo.currency) {
      return setCError(true);
    } else {
      setCError(false);
    }

    setAddLoading(true);

    // get the name of the bank and store it
    const data = wData.banks_list.filter((b) => b.id == bankInfo.bank_id);
    // verify bank details
    // skip usd verifications
    if (bankInfo.currency == "NGN") {
      const verify = await verifyBank(data[0].code, bankInfo.nuban);
      // check if verify is true / false
      if (!verify) return;
    }
    // store the info to the db
    const user = JSON.parse(localStorage.getItem("account"));
    // request config
    var config = {
      method: "post",
      url: `${apiAddress}/stocks/bank/add`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: {
        bank_name: data[0].name,
        bank_id: data[0].id,
        currency: bankInfo.currency,
        user_id: user.id,
        nuban: bankInfo.nuban,
      },
    };
    // try catch to handle on success / on failure
    try {
      const res = await axios(config);

      toast.success("Bank account added sucessfully.");
    } catch (e) {
      // api error for storing the account number
      toast.error(e?.response?.data?.message);
      // console.log(e);
      setAddLoading(false);
      return;
    }

    // refresh getting the accounts for this user
    getUserBanks();
    // toggle add acc section
    setAddAcc(!addAcc);
    // turn off spinner
    setAddLoading(false);
    // logs
    // console.log(
    //   data[0].name,
    //   user.id,
    //   data[0].id,
    //   bankInfo.nuban,
    //   process.env.NEXT_PUBLIC_MONO,
    //   JSON.parse(localStorage.getItem("token"))
    // );
  };

  /**
   *
   * VERIFY BANK
   *
   */
  const verifyBank = async (code, nuban) => {
    const options = {
      method: "POST",
      url: "https://api.withmono.com/v1/misc/verify/account",
      headers: {
        Accept: "application/json",
        "mono-sec-key": process.env.NEXT_PUBLIC_MONO,
        "Content-Type": "application/json",
      },
      data: { bank_code: code, account_number: nuban },
    };

    try {
      const res = await axios.request(options);
      setFBank(res.data.data);
      return true;
    } catch (e) {
      // display api error from mono
      setAddLoading(false);
      console.log("error", e);
      toast.error(e?.response?.data?.message);
      return false;
    }
  };

  /**
   *
   * GET USER
   * BANK ACCOUNTS
   *
   */
  const getUserBanks = async () => {
    const user = JSON.parse(localStorage.getItem("account"));
    const res = await axios.get(`${apiAddress}/stocks/bank/${user.id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    setUserBanks(res.data.data);
    // console.log(res.data);
  };

  /**
   *
   * COMPLETE
   * WITHDRAWAL
   *
   */
  const completeWithdrawal = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!sData.account_id) {
      setLoading(false);
      return setAError(true);
    } else {
      setAError(false);
    }

    // pass data to wp backend for processing
    const user = JSON.parse(localStorage.getItem("account"));
    const b = JSON.parse(localStorage.getItem("user"));

    const body = {
      amount: sData.amount,
      account_id: sData.account_id,
      jwt: b.jwt,
    };

    try {
      const res = await axios.post(`${apiAddress}/stocks/bank/withdraw`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      console.log(res);
      toast.success(e?.response?.data?.message ?? "Withdrawal in progress.");
      toggleAdd();
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message);
      setLoading(false);
    }

    setLoading(false);
    console.log(sData, user.id);
  };

  return (
    <Transition appear show={showDep} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={toggleAdd}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-1/4 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <form onSubmit={completeWithdrawal} className="space-y-12">
                  <div className="space-y-4 bg-white">
                    <div className="mt-3 flex justify-between text-center sm:mt-1 sm:text-left">
                      <h3
                        className="text-lg font-bold capitalize leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Withdraw Funds
                      </h3>
                      <svg
                        onClick={toggleAdd}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 cursor-pointer fill-current text-gray-500 hover:text-gray-800"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* <div className="text-2xs grid grid-cols-3 gap-4">
                      <div>
                        <div className="font-semibold uppercase">rate</div>
                        <div>{wData?.exchange_rate}</div>
                      </div>

                      <div>
                        <div className="font-semibold uppercase">fee</div>
                        <div>
                          {wData?.fees_dollar} / {wData?.fees_naira}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold uppercase">
                          withdrawable
                        </div>
                        <div>{wData?.withdrawal_cash}</div>
                      </div>

                      <div>
                        <div className="font-semibold uppercase">timeline</div>
                        <div>{wData?.timeline}</div>
                      </div>

                      <div>
                        <div className="font-semibold uppercase">type</div>
                        <div>{wData?.name}</div>
                      </div>
                    </div> */}

                    <div className="sm:items-start">
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="bg-white">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 space-y-3">
                              <div className="text-xs">Amount</div>
                              <CurrencyInput
                                type="text"
                                name="amount"
                                required
                                onValueChange={(value) =>
                                  setSData({ ...sData, amount: value })
                                }
                                placeholder="$"
                                className="mt-1 block w-full rounded-md border-gray-300 uppercase shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="cap text-xs">Select Account</div>
                      <select
                        name="bank_id"
                        onChange={(e) =>
                          setSData({ ...sData, account_id: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                      >
                        <option>Select</option>

                        {userBanks.map((u) => (
                          <option key={u?.id} value={u?.id}>
                            {u?.bank_name} - {u?.currency} - {u?.nuban}
                          </option>
                        ))}
                      </select>

                      {aError && (
                        <div className="text-2xs text-red-500">
                          Select an account
                        </div>
                      )}
                    </div>

                    <div className="sm:items-start">
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="bg-white grid grid-cols-2">
                          <button
                            disabled={addAcc || loading ? true : false}
                            type="submit"
                            className="btn flex w-36 justify-between border-none bg-green-600 capitalize hover:bg-green-700"
                          >
                            Complete
                            {!loading ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <Spin />
                            )}
                          </button>

                          <div className="grid justify-end">
                            <div
                              onClick={() => setAddAcc(!addAcc)}
                              className="place-self-center hover:opacity-80 cursor-pointer space-x-2 flex items-center"
                            >
                              {!addAcc ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 text-blue-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 text-red-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              )}

                              <div className="text-2xs font-medium tracking-wide uppercase">
                                new account
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {addAcc && (
                  <>
                    <div className="border-t border-gray-100 my-8"></div>

                    <form className="space-y-3" onSubmit={handleAddAccount}>
                      <div
                        className="font-bold capitalize leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Add a bank account
                      </div>

                      <div className="space-y-3">
                        <div className="cap text-xs">Select Bank</div>
                        <select
                          name="bank_id"
                          onChange={(e) =>
                            setBankInfo({
                              ...bankInfo,
                              bank_id: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                        >
                          <option>Select</option>
                          {wData?.banks_list.map((b) => (
                            <option key={b?.code} value={b?.id}>
                              {b?.name}
                            </option>
                          ))}
                        </select>
                        {bError && (
                          <div className="text-2xs text-red-500">
                            Select a bank
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="cap text-xs">Select Currency</div>
                        <select
                          required
                          name="currency"
                          onChange={(e) =>
                            setBankInfo({
                              ...bankInfo,
                              currency: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                        >
                          <option>Select</option>
                          <option>USD</option>
                          <option>NGN</option>
                          {/* */}
                        </select>
                        {cError && (
                          <div className="text-2xs text-red-500">
                            Select account currency
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {/* <div className="cap text-xs">NUBAN</div> */}
                        <input
                          onChange={(e) =>
                            setBankInfo({
                              ...bankInfo,
                              nuban: e.target.value,
                            })
                          }
                          required
                          type="number"
                          placeholder="NUBAN"
                          name="nuban"
                          className="mt-1 block w-full rounded-md border-gray-300 uppercase shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                        />

                        {Object.keys(fBank).length > 0 && (
                          <div className="cap text-[10px]">
                            {fBank?.account_name}
                          </div>
                        )}
                      </div>

                      <div className="sm:items-start">
                        <div className="overflow-hidden sm:rounded-md">
                          <div className="bg-white">
                            <button
                              type="submit"
                              disabled={addLoading ? true : false}
                              className="btn mt-6 flex w-36 justify-between place-self-end border-none capitalize"
                            >
                              Add
                              {addLoading ? (
                                <Spin />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={0.5}
                                  stroke="currentColor"
                                  className="w-7 h-7"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v12m6-6H6"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

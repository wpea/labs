import AppLayout from "./../../components/Layouts/AppLayout";
import Head from "next/head";
import Header from "./../../components/header";
import Table from "./../../components/Clubs/table";
import { useEffect, useState } from "react";
import Spin from "./../../components/Spin";
import currency from "currency.js";
import AddStock from "./../../components/addStock";
import axios from "axios";
import { apiAddress } from "../../lib/api";
import { useRouter } from 'next/router';

export default function Stocks() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newStock, setNewStock] = useState({});
  const [stocks, setStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [purchased, setPurchased] = useState([
    // {
    //   symbol: "TSLA",
    //   buy_price: 916.9,
    //   shares: 3,
    // },
    // {
    //   symbol: "JNJ",
    //   buy_price: 168.06,
    //   shares: 9,
    // },
    // {
    //   symbol: "NVDA",
    //   buy_price: 235.02,
    //   shares: 5,
    // },
    // {
    //   symbol: "HD",
    //   buy_price: 351.53,
    //   shares: 3,
    // },
    // {
    //   symbol: "FB",
    //   buy_price: 315.07,
    //   shares: 6,
    // },
    // {
    //   symbol: "MSFT",
    //   buy_price: 302.5,
    //   shares: 20,
    // },
    // {
    //   symbol: "CSCO",
    //   buy_price: 55.67,
    //   shares: 8,
    // },
    // {
    //   symbol: "GOOG",
    //   buy_price: 2713.97,
    //   shares: 2,
    // },
    // {
    //   symbol: "ADBE",
    //   buy_price: 534.3,
    //   shares: 2,
    // },
    // {
    //   symbol: "PG",
    //   buy_price: 160.45,
    //   shares: 7,
    // },
    // {
    //   symbol: "TMO",
    //   buy_price: 581.3,
    //   shares: 2,
    // },
    // {
    //   symbol: "LLY",
    //   buy_price: 245.39,
    //   shares: 4,
    // },
  ]);

  const [allStocks, setAllStocks] = useState([
    // "TSLA",
    // "JNJ",
    // "NVDA",
    // "HD",
    // "FB",
    // "MSFT",
    // "CSCO",
    // "GOOG",
    // "ADBE",
    // "PG",
    // "TMO",
    // "LLY",
  ]);

  useEffect(() => {
    getDBStockData();
  }, []);

  const getDBStockData = async () => {
    const t = localStorage.getItem("token");

    const stocks = await axios.get(`${apiAddress}/stocks/get/stocks`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(t)}`,
      },
    });

    const symbols = await axios.get(`${apiAddress}/stocks/get/symbols`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(t)}`,
      },
    });

    setAllStocks(symbols.data.data);
    setPurchased(stocks.data.data);

    getStocks(symbols.data.data);
  };

  const getStocks = async (stocks) => {
    setLoading(true);
    const ax = await axios.get(
      `https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${String(
        stocks
      )}`,
      {
        headers: {
          "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
          "X-RapidAPI-Key":
            "60bccc499emsha8468ff6555c660p1d8a41jsn89d974b2725c",
        },
      }
    );

    // const data = await res.json();
    setStocks(ax?.data?.quoteResponse?.result);
    setLoading(false);
  };

  const Th = ({ data }) => {
    return data.map((t) => (
      <div
        key={t}
        className="grid items-center border-r py-4 text-xs font-medium tracking-tight"
      >
        {t}
      </div>
    ));
  };

  const Td = ({ value }) => {
    return (
      <div className="grid items-center border-r py-4 text-xs font-semibold tracking-tight">
        {value}
      </div>
    );
  };

  const brokerageFee = (shares, bp) => {
    return parseInt(shares) * parseInt(bp) * 0.01;
  };

  const commission = (shares, bp) => {
    return parseInt(shares) * parseInt(bp) * 0.0015;
  };

  const initValue = (shares, bp) => {
    var bf = brokerageFee(shares, bp);
    var c = commission(shares, bp);
    var total_c = c * 2;
    var total = shares * bp + total_c + bf;
    return total;
  };

  const currentPortPerc = (pv) => {
    var sum = purchased.reduce((previousValue, currentValue) => {
      var p = currentValue.shares * currentValue.buy_price;
      var bf = brokerageFee(currentValue.shares, currentValue.buy_price);
      var c = commission(currentValue.shares, currentValue.buy_price);
      var total_c = c * 2;
      return previousValue + (p + bf + total_c);
    }, 0);
    return (pv / sum) * 100;
  };

  const currentPrice = (symbol) => {
    var f = stocks.filter((s) => s.symbol === symbol);
    return f.length > 0 ? f[0].regularMarketPrice : 0;
  };

  const pfvCurrent = (symbol, shares) => {
    var c = currentPrice(symbol);
    return c * shares;
  };

  // portTotalValuePerc
  const ptvp = (symbol, shares, bp) => {
    const initVal = initValue(shares, bp);
    var total =
      ((pfvCurrent(symbol, shares) - initVal) / initVal) *
      currentPortPerc(initVal);
    return total;
  };

  const ptr = (symbol, shares, bp) => {
    var total = pfvCurrent(symbol, shares) - initValue(shares, bp);
    return total;
  };

  const symbolName = (symbol) => {
    var f = stocks.filter((s) => s.symbol === symbol);
    return f.length > 0 ? f[0].shortName : "";
  };

  const toggleAdd = () => {
    setOpen(!open);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStock = () => {
    setOpen(!open);
    setPurchased([...purchased, newStock]);
    setAllStocks([...allStocks, newStock?.symbol]);
    getStocks();
    // console.log(newStock, purchased, allStocks);
  };

  /** Bamboo stock reg */
  const [bModal, setBModal] = useState(false);

  return (
    <>
      <AppLayout>
        <Head>
          <title>home &mdash; wplabs</title>
          <meta
            name="description"
            content="WP Stocks - Innovating the family office."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="w-full grid">
          <div className="lg:px-20 p-10 space-y-10 grid">
            <Header />

            <div className="md:flex items-center justify-between border-t pt-10 space-y-10 md:space-y-0">
              <div className="md:flex items-center space-y-6 md:space-y-0">
                <button
                  onClick={toggleAdd}
                  className="focus:ring-none inline-flex w-full justify-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add a stock
                </button>

                <button
                  onClick={() => router.push("/stocks/create/step-one")}
                  className="focus:ring-none inline-flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create a stock account
                </button>

                <button
                  onClick={() => router.push("/stocks/dashboard")}
                  className="focus:ring-none inline-flex w-full justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  View stock accounts
                </button>

                {loading && <Spin />}
              </div>

              <div className="flex md:block items-center justify-between">
                <div className="text-xs uppercase text-gray-400">
                  All Stocks
                </div>
                <div className="text-xl text-gray-700 text-right">
                  {purchased?.length}
                </div>
              </div>
            </div>

            <div className="border-t pt-10">
              <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-4">
                {stocks?.length > 0 ? (
                  stocks.map((s) => (
                    <div
                      key={s?.symbol}
                      className="w-full rounded-xl bg-gray-100 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold uppercase">
                          {s?.symbol}
                        </div>
                        <div
                          className={`${
                            s?.regularMarketChangePercent < 0
                              ? `text-red-600`
                              : `text-green-600`
                          } flex`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`${
                              s?.regularMarketChangePercent < 0
                                ? ""
                                : `rotate-180`
                            } mt-[0.3px] h-4 w-4`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="text-xs font-semibold">
                            {currency(s?.regularMarketChangePercent).value}%
                            {/**<span className="font-light">24h</span>*/}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">{s?.shortName}</div>
                      <div>
                        <div className="text-4xl">
                          {currency(s?.regularMarketPrice).format()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm col-span-5 text-gray-400 text-center">
                    No stocks added yet.
                  </div>
                )}
              </div>
            </div>

            {purchased.length > 0 ? (
              <div className="border lg:block hidden">
                <div className="grid grid-cols-12 gap-3 px-2 overflow-x-auto w-full border-b bg-gray-100 text-gray-500">
                  {/* <!-- Head --> */}
                  <Th
                    data={[
                      "Symbol",
                      "Shares",
                      "Buy Price",
                      "Brokerage Fees",
                      "Commission Abroad",
                      "Federal Turnover Tax",
                      "Portfolio Value (Initial)",
                      "Current Protfolio Percentage",
                      "Current Price",
                      "Portfolio Value (Current)",
                      "Portfolio Total Return",
                      "Portfolio Return 24hr",
                    ]}
                  />
                </div>

                {purchased.map((p) => (
                  <div
                    key={p?.symbol}
                    className="grid grid-cols-12 gap-3 px-2 overflow-x-auto border-b"
                  >
                    <div className="grid items-center border-r py-4 text-xs tracking-tight">
                      <div>
                        <div className="font-bold text-blue-700">
                          {p?.symbol}
                        </div>
                        <div>{symbolName(p?.symbol)}</div>
                      </div>
                    </div>

                    <div className="grid items-center border-r py-4 text-xl tracking-tight">
                      {p?.shares}
                    </div>

                    <Td value={currency(p?.buy_price).format()} />
                    <Td
                      value={currency(
                        brokerageFee(p?.shares, p?.buy_price)
                      ).format()}
                    />
                    <Td
                      value={currency(
                        commission(p?.shares, p?.buy_price)
                      ).format()}
                    />
                    <Td
                      value={currency(
                        commission(p?.shares, p?.buy_price)
                      ).format()}
                    />
                    <Td
                      value={currency(
                        initValue(p?.shares, p?.buy_price)
                      ).format()}
                    />

                    <div className="grid items-center border-r py-4 text-xs tracking-tight">
                      {
                        currency(
                          currentPortPerc(initValue(p?.shares, p?.buy_price))
                        ).value
                      }
                      %
                    </div>

                    <Td value={currency(currentPrice(p?.symbol)).format()} />
                    <Td
                      value={currency(
                        pfvCurrent(p?.symbol, p?.shares)
                      ).format()}
                    />

                    <div
                      className={`grid items-center space-y-3 border-r py-4 pr-2 text-xs tracking-tight ${
                        ptvp(p?.symbol, p?.shares, p?.buy_price) < 0
                          ? `text-red-600`
                          : `text-green-600`
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${
                          ptvp(p?.symbol, p?.shares, p?.buy_price) > 0 &&
                          `rotate-180`
                        } h-5 w-5 justify-self-center`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <div className="flex justify-between">
                        <div>%</div>
                        <div className="font-semibold">
                          {
                            currency(ptvp(p?.symbol, p?.shares, p?.buy_price))
                              .value
                          }
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>$</div>
                        <div className="font-semibold">
                          {
                            currency(ptr(p?.symbol, p?.shares, p?.buy_price))
                              .value
                          }
                        </div>
                      </div>
                    </div>
                    <div className="grid items-center space-y-3 border-r py-4 pr-2 text-xs tracking-tight">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 rotate-180 justify-self-center text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex justify-between">
                        <div>%</div>
                        <div className="font-semibold text-red-600">-0</div>
                      </div>

                      <div className="flex justify-between">
                        <div>$</div>
                        <div className="font-semibold text-red-600">0</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div></div>
            </div>
          </div>
        </div>

        {open && (
          <AddStock
            toggleAdd={toggleAdd}
            status={open}
            data={handleChange}
            button={handleAddStock}
          />
        )}
      </AppLayout>
    </>
  );
}

import { useState, useEffect } from "react";
import Table from "../../../components/asset-allocation/Table";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/router";

const formatCompact = (number) => {
  const formatter = new Intl.NumberFormat("en", {
    notation: "standard",
  });
  return formatter.format(number);
};

const FundManager = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { fundmanagerId } = router.query;

  useEffect(() => {
    const getFundManager = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/fundmanager/${fundmanagerId}`
        );
        setData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFundManager();
    console.log(data);
  }, [fundmanagerId, data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen p-10">
      <div className="flex gap-8 justify-between items-start py-12">
        <div className="flex gap-8">
          <div className="rounded-full w-14 h-14 overflow-hidden flex justify-center items-center   bg-[#F4F5F6]">
            <Image
              alt=""
              src={data.image ? data.image : "/images/default.png"}
              width={48}
              height={48}
              className="mx-auto max-w-full max-h-full"
            />
          </div>
          <div className="w-1/2  flex flex-col gap-4">
            <h2 className="font-semibold mb-2 text-gray-700">{data.name}</h2>
            <p className="font-light ">{data.description}</p>
            <p className="font-semibold">Investment Certificate(s)</p>
            <div href={data.link} className="flex items-center gap-2">
              <FiExternalLink />
              <a
                href={data.link}
                target="_blank"
                className="underline"
                rel="noreferrer"
              >
                {data.link.substring(0, 20)}
              </a>
            </div>
          </div>
        </div>
        <div className="mb-12 w-1/4">
          <span
            href="#"
            className="block max-w-sm p-6  border  rounded-lg shadow  bg-[#F4F5F6]  "
          >
            <p className="font-normal  ">Total Invested</p>
            <h5 className="my-2 text-2xl font-bold tracking-tight  ">
              ₦ {data.total ? formatCompact(data.total) : "0"}
            </h5>
          </span>
        </div>
      </div>

      <Table transactions={data.transaction} />
    </div>
  );
};

export default FundManager;

import Link from "next/link";
import DashboardLayout from "../../../../../../components/investment-club/DashboardLayout";
import { useRouter } from "next/router";

const KYC = () => {
  const router = useRouter();
  const { clubname } = router.query;
  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <Link
          passHref
          href={`/investment-clubs/${clubname}/dashboard/transactions`}
          className="text-[10px] gap-x-2 flex items-center mb-6"
        >
          <button className="flex items-center gap-6">
            <svg
              width="5"
              height="8"
              viewBox="0 0 5 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.81249 1.3125L1.30936 3.81564C1.16353 3.96147 1.09061 4.03438 1.09061 4.12499C1.09061 4.2156 1.16353 4.28852 1.30936 4.43435L3.81249 6.93749"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>{" "}
            <p>Go Back</p>
          </button>
        </Link>
        <h1 className="text-[#2D2D2D] text-2xl font-semibold mb-6">
          KYC Documentation
        </h1>

        <div className="">
          <div className=" w-2/3 bg-white rounded-md my-6 border-b-[0.5px]">
            <div className="border-b-[0.5px] p-5">
              <h1 className="text-[#969696]  text-sm mb-4 font-semibold">
                Personal Details
              </h1>
              <div className="flex justify-between">
                <div className="w-1/3">
                  <p className="text-[8px]">Name</p>
                  <p className="text-[10px] font-semibold">Abigail Trujillo</p>
                </div>
                <div className="w-1/3">
                  <p className="text-[8px]">Email</p>
                  <p className="text-[10px] font-semibold">
                    test@wealthparadigm.org
                  </p>
                </div>
                <div className="w-1/3">
                  <p className="text-[8px]">Occupation</p>
                  <p className="text-[10px] font-semibold">Lawyer</p>
                </div>
              </div>
            </div>

            <div className="border-b-[0.5px]  p-5">
              <h1 className="text-[#969696]  text-sm mb-4 font-semibold">
                Bank Account Details
              </h1>
              <div className="flex justify-between">
                <div className="w-1/3">
                  <p className="text-[8px]">Bank Name</p>
                  <p className="text-[10px] font-semibold">
                    United Bank for Africa
                  </p>
                </div>
                <div className="w-1/3">
                  <p className="text-[8px]">Account name</p>
                  <p className="text-[10px] font-semibold">Abigail Trujillo</p>
                </div>
                <div className="w-1/3">
                  <p className="text-[8px]">Account number</p>
                  <p className="text-[10px] font-semibold">2119267248</p>
                </div>
              </div>
            </div>

            <div className=" p-5">
              <h1 className="text-[#969696]  text-sm mb-4 font-semibold">
                Next of Kin
              </h1>
              <div className="flex justify-between">
                <div className="w-1/3">
                  <p className="text-[8px]">Name</p>
                  <p className="text-[10px] font-semibold">Ahmad Trujillo</p>
                </div>
                <div className="w-1/3">
                  <p className="text-[8px]">Phone</p>
                  <p className="text-[10px] font-semibold">+2348033850275</p>
                </div>
                <div className="w-1/3">
                  <p className="text-[8px]">Email</p>
                  <p className="text-[10px] font-semibold">
                    a.trujillo@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" p-5 w-2/3 bg-[#BDBDBD45] rounded-md my-6 border-b-[0.5px]">
          <h1 className="text-[#2D2D2D] text-2xl font-semibold mb-6">
            Valid ID
          </h1>
          <div className="bg-[#BDBDBD45] w-full h-[153px] mx-auto flex justify-center items-center">
            <svg
              width="57"
              height="57"
              viewBox="0 0 57 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="15.9474"
                cy="15.9479"
                r="4.18421"
                stroke="black"
                strokeOpacity="0.14"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 28.5C2 16.0078 2 9.76167 5.88084 5.88084C9.76167 2 16.0078 2 28.5 2C40.9922 2 47.2383 2 51.1192 5.88084C55 9.76167 55 16.0078 55 28.5C55 40.9922 55 47.2383 51.1192 51.1192C47.2383 55 40.9922 55 28.5 55C16.0078 55 9.76167 55 5.88084 51.1192C2 47.2383 2 40.9922 2 28.5Z"
                stroke="black"
                strokeOpacity="0.14"
                strokeWidth="4"
              />
              <path
                d="M8.97369 53.6051C21.1705 39.0301 34.8434 19.808 54.9929 32.8024"
                stroke="black"
                strokeOpacity="0.14"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KYC;

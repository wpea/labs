import { useRouter } from "next/router";
import { WPEALogo, RightArrow } from "../../assets/SVGs";

const TempReport = () => {
  const router = useRouter();
  return (
    <div className="mx-auto flex flex-col w-1/5  ">
      <WPEALogo />
      <p className="text-left mb-5">Enter Acccess Code :</p>
      <input type="text" className="rounded mb-5" />
      <button
        className="border bg-[#2D7EC2] w-full rounded-md p-2  mx-auto"
        onClick={() => {
          console.log("stuff");
          router.push("/temp-report/Jamila");
        }}
      >
        <div className="flex justify-between items-center px-5">
          <p className="text-white">Go</p>
          <div className=" flex">
            <RightArrow />
          </div>
        </div>
      </button>
    </div>
  );
};

export default TempReport;

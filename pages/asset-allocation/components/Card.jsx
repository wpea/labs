import Image from "next/image";
import Link from "next/link";

const Card = ({ src, href, name, description }) => {
  return (
    <>
      <Link
        passHref
        href={`asset-allocation/fundmanager/${href}`}
        className="max-w-sm flex items-center justify-center  overflow-hidden  p-6 w-72 h-32 border  rounded-lg shadow bg-[#F4F5F6] dark:border-gray-700"
      >
        <Image
          alt="fund manager logo"
          className="text-left mb-8 items-center justify-center "
          src={src}
          width={148}
          height={148}
        />
      </Link>
    </>
  );
};

export default Card;

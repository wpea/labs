import Image from "next/image";
import Link from "next/link";

const Card = ({ src, href, name, description }) => {
  return (
    <>
      <Link
        passHref
        href={`asset-allocation/fundmanager/${href}`}
      >
        <div className="cursor-pointer border bg-gray-100 grid gap-5 grid-flow-col  auto-cols-max rounded-md place-items-center py-4 px-4 shadow-sm bg-center">
          <div className="w-16 h-16 bg-center bg-contain bg-no-repeat bg-gray-200 rounded-full" style={{ backgroundImage: `url(${src})`}}></div>
          <div className="capitalize">Fund manager name</div>
          </div>
      </Link>
    </>
  );
};

export default Card;

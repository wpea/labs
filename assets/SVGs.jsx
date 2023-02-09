import Image from "next/image";

export const WPEALogo = () => {
  return (
    <Image
      src={"/images/wpea.svg"}
      alt="Wealth Paradigm Ethical Advisory"
      height={24}
      width={149}
    />
  );
};

export const RightArrow = () => {
  return (
    <Image
      src={"/images/rightArrow.svg"}
      alt="Wealth Paradigm Ethical Advisory"
      height={24}
      width={24}
    />
  );
};

export const Download = () => {
  return (
    <Image
      src={"/images/download.svg"}
      alt="Download Report"
      height={24}
      width={24}
    />
  );
};

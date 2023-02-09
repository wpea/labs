import React from "react";

const AssetInfo = ({ title, value }) => {
  return (
    <div className="flex flex-col">
      <span className="text-[#1468AE] text-xs font-medium ">{title}</span>
      <p className="text-2xl font-normal w-fit basis-1/3">{value}</p>
    </div>
  );
};

export default AssetInfo;

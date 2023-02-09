const PortfolioValue = ({ ammount, date, clientName }) => {
  return (
    <div className="flex items-center justify-between my-20">
      <div className="flex flex-col">
        <p className="text-xs font-bold mb-2">Portfolio Value</p>
        <p className="text-[34px] font-bold mb-4">{ammount}</p>
        <p className="text-xs font-normal">As at {date}</p>
      </div>
      <div>
        <p className=" font-medium text-2xl">{clientName}</p>
      </div>
    </div>
  );
};

export default PortfolioValue;

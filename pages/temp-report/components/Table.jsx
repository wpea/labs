import AssetClass from "./AssetClass";
import AssetInfo from "./AssetInfo";

const Table = () => {
  return (
    <div className="h-72 flex mb-24">
      <div className="border-t-[0.5px] border-black border-r-[0.5px] w-1/6">
        <p className="text-xs font-bold pt-7 pr-7">Investment Portfolio</p>
      </div>

      <div className="flex flex-col   w-5/6">
        <AssetClass>
          <AssetInfo title="Name" value="Global USD Sukuk" />
          <AssetInfo title="Ammount" value="$12,000" />
          <AssetInfo title="Days" value="121" />
          <AssetInfo title="Rate" value="8.0%" />
          <AssetInfo title="Fee" value="$112" />
        </AssetClass>

        <AssetClass>
          <AssetInfo title="Name" value="Halal Money Market" />
          <AssetInfo title="Ammount" value="$12,000" />
          <AssetInfo title="Days" value="121" />
          <AssetInfo title="Rate" value="8.0%" />
          <AssetInfo title="Fee" value="$112" />
        </AssetClass>
      </div>
    </div>
  );
};

export default Table;

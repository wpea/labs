export default function StockInfo({bg, key, name, symbol, perc_change, price, quantity, total_return, value_change, equity, logo}) {
    return (
      <div key={key} className="cursor-pointer border-t bg-gray-50 py-6 hover:bg-gray-100">
        <div className="ml-20 grid grid-cols-8">
          <div
            className={`grid h-16 w-16 place-items-center self-center rounded-full bg-gray-200 p-2`}
          >
            <img className={`w-10`} src={logo} alt={name} />
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              {name}
            </div>
            <div className="self-center font-ibm text-xl uppercase">
              {symbol}
            </div>
          </div>
          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              qty
            </div>
            <div className="self-center font-ibm text-xl">{quantity}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              equity
            </div>
            <div className="self-center font-ibm text-xl">{equity}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              market price
            </div>
            <div className="self-center font-ibm text-xl">${price}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              change
            </div>
            <div
              className={`${
                perc_change > 0 ? `text-green-600` : `text-red-600`
              } self-center font-ibm text-xl`}
            >
              {perc_change}%
            </div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              value change ($)
            </div>
            <div
              className={`${
                value_change > 0 ? `text-green-600` : `text-red-600`
              } self-center font-ibm text-xl`}
            >
              {value_change}
            </div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              total return ($)
            </div>
            <div
              className={`${
                total_return > 0 ? `text-green-600` : `text-red-600`
              } self-center font-ibm text-xl`}
            >
              {total_return}
            </div>
          </div>

          <div className="self-center"></div>
        </div>
      </div>
    );
}
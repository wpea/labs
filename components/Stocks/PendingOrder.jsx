export default function PendingOrder({key, name, symbol, fee, status, side, price, pps, quantity, logo}) {
    return (
      <div
        key={key}
        className="cursor-pointer border-t bg-gray-50 py-6 hover:bg-gray-100"
      >
        <div className="lg:ml-20 ml-10 grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 md:gap-10 gap-5 lg:gap-0">
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
              side
            </div>
            <div className={`${side === 'Buy' ? `text-green-600` : `text-red-600`} self-center font-ibm text-xl font-bold uppercase`}>{side}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              order price
            </div>
            <div className="self-center font-ibm text-xl">${price}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              price per share
            </div>
            <div className="self-center font-ibm text-xl">${pps}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              fee
            </div>
            <div className="self-center font-ibm text-xl">${fee}</div>
          </div>

          <div className="self-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              status
            </div>
            <div className="self-center font-ibm text-xl uppercase">
              {status}
            </div>
          </div>
          <div className="self-center"></div>
        </div>
      </div>
    );
}
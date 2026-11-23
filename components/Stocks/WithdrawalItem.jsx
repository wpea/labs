export default function WithdrawalItem({
  amount,
  dollar_amount,
  currency,
  status,
  reference,
  bank_name,
  account_number,
  created_at,
  fees,
}) {
  const statusColor = (s) => {
    const v = (s ?? "").toLowerCase();
    if (v === "sent" || v.includes("success") || v.includes("complet") || v.includes("disbursed")) return "text-green-600";
    if (v.includes("fail") || v.includes("error") || v.includes("reject")) return "text-red-600";
    return "text-yellow-600";
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="cursor-default border-t bg-gray-50 py-6">
      <div className="lg:ml-20 ml-10 grid lg:grid-cols-7 md:grid-cols-4 grid-cols-2 md:gap-10 gap-5 lg:gap-0">
        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">amount</div>
          <div className="self-center font-ibm text-xl">
            {currency === "USD" ? "$" : ""}
            {amount ?? dollar_amount ?? 0}
            {currency && currency !== "USD" ? ` ${currency}` : ""}
          </div>
        </div>

        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">currency</div>
          <div className="self-center font-ibm text-xl uppercase">{currency ?? "—"}</div>
        </div>

        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">bank</div>
          <div className="self-center font-ibm text-sm truncate">{bank_name ?? "—"}</div>
        </div>

        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">account</div>
          <div className="self-center font-ibm text-sm">{account_number ?? "—"}</div>
        </div>

        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">fees</div>
          <div className="self-center font-ibm text-sm">{fees ?? "—"}</div>
        </div>

        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">date</div>
          <div className="self-center font-ibm text-sm">{formatDate(created_at)}</div>
        </div>

        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">status</div>
          <div className={`${statusColor(status)} self-center font-ibm text-xl uppercase`}>
            {status ?? "—"}
          </div>
          {reference && (
            <div className="text-[10px] text-gray-400 truncate" title={reference}>
              {reference}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

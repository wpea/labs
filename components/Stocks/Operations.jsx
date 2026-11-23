import { useState } from "react";
import { toast } from "react-hot-toast";
import { bamboo } from "../../lib/bamboo";
import Spin from "../Misc/Spin";

// Rows for orders/withdrawals whose outcome Bamboo has not confirmed yet.
// Styled like PendingOrder rows; "Check status" reconciles with Bamboo.
export default function Operations({ accountId, operations, onUpdated }) {
  const [busy, setBusy] = useState(null);

  async function check(op) {
    if (busy) return;
    setBusy(op.id);
    try {
      await bamboo(`/operations/${op.id}/refresh`, {
        method: "POST",
        accountId,
      });
      await onUpdated();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(null);
    }
  }

  return operations.map((op) => (
    <div key={op.id} className="border-t bg-gray-50 py-6">
      <div className="lg:ml-20 ml-10 grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 md:gap-10 gap-5 lg:gap-0">
        <div className="self-center">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">
            {op.kind}
          </div>
          <div className="self-center font-ibm text-xl uppercase text-yellow-600">
            {op.status}
          </div>
        </div>

        <div className="self-center lg:col-span-5 md:col-span-2">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">
            reference
          </div>
          <div className="self-center font-ibm text-sm break-all">
            {op.reference}
          </div>
          <div className="text-2xs text-gray-500">
            Outcome not yet confirmed by Bamboo. Do not submit this again.
          </div>
        </div>

        <div className="self-center">
          <button
            type="button"
            disabled={!!busy}
            onClick={() => check(op)}
            className="btn btn-sm btn-outline capitalize"
          >
            {busy === op.id ? <Spin /> : "Check status"}
          </button>
        </div>
      </div>
    </div>
  ));
}

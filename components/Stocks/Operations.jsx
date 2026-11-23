import { useState } from "react";
import { bamboo } from "../../lib/bamboo";
export default function Operations({
  accountId,
  operations,
  onUpdated,
  nextPage,
  loadMore,
}) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  async function act(op, action) {
    if (busy) return;
    setBusy(op.id);
    setError("");
    try {
      await bamboo(`/operations/${op.id}/${action}`, {
        method: "POST",
        accountId,
      });
      await onUpdated();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="p-6 lg:px-20 border-b space-y-4">
      <h2 className="text-xl font-bold">Transaction activity</h2>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {!operations.length && (
        <p className="text-gray-600">
          No transactions recorded by this integration yet.
        </p>
      )}
      {operations.map((op) => (
        <div
          key={op.id}
          className="border rounded p-4 flex flex-wrap items-center gap-4"
        >
          <div className="flex-1">
            <p className="font-bold capitalize">
              {op.kind} · {op.status}
            </p>
            <p className="text-xs text-gray-500 break-all">{op.reference}</p>
            {op.upstream_id && (
              <p className="text-xs">Bamboo ID: {op.upstream_id}</p>
            )}
            {["unknown", "submitting"].includes(op.status) && (
              <p className="text-sm text-amber-800">
                Outcome needs reconciliation. Do not submit this transaction
                again.
              </p>
            )}
          </div>
          <button
            disabled={!!busy}
            className="btn btn-sm btn-outline"
            onClick={() => act(op, "refresh")}
          >
            Check status
          </button>
          {op.kind === "order" &&
            op.upstream_id &&
            ![
              "filled",
              "rejected",
              "cancelled",
              "canceled",
              "cancel_requested",
              "cancel_submitting",
              "cancel_unknown",
            ].includes(op.status) && (
              <button
                disabled={!!busy}
                className="btn btn-sm btn-outline"
                onClick={() => act(op, "cancel")}
              >
                Cancel order
              </button>
            )}
        </div>
      ))}
      {nextPage && (
        <button className="btn btn-sm" onClick={loadMore}>
          Load more activity
        </button>
      )}
    </div>
  );
}

import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import { bamboo } from "../../lib/bamboo";
import ActionDialog from "./ActionDialog";
export default function MoneyMovement({
  kind,
  accountId,
  showDep,
  toggleAdd,
  onSuccess,
}) {
  const deposit = kind === "deposit";
  const [reference, setReference] = useState(uuid);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unknown, setUnknown] = useState(false);
  const [rejected, setRejected] = useState(false);
  const submitting = useRef(false);
  async function submit(e) {
    e.preventDefault();
    if (submitting.current || unknown || rejected) return;
    if (!deposit && !Number.isInteger(Number(amount))) {
      setError(
        "Enter a whole-unit amount. Fractional withdrawal amounts are not supported."
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      await bamboo(deposit ? "/deposits" : "/withdrawals", {
        method: "POST",
        accountId,
        data: {
          reference,
          amount: Number(amount),
          currency,
          ...(deposit
            ? { transaction_date: date, funds_received: confirmed }
            : { market: "US" }),
        },
      });
      toast.success(
        deposit
          ? "Deposit submitted for verification."
          : "Withdrawal requested. Track it in transaction activity."
      );
      onSuccess();
      toggleAdd();
    } catch (e) {
      setError(e.message);
      if (
        e.code === "outcome_unknown" ||
        !e.response ||
        e.response?.status >= 500
      )
        setUnknown(true);
      else if (e.code === "upstream_error" || e.code === "previously_rejected")
        setRejected(true);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <ActionDialog
      title={deposit ? "Record received deposit" : "Withdraw funds"}
      open={showDep}
      onClose={toggleAdd}
      busy={busy}
    >
      <form onSubmit={submit} className="space-y-5">
        <fieldset disabled={busy || unknown || rejected} className="space-y-4">
          {deposit && (
            <p className="text-sm text-gray-600">
              Record funds already received and verified by your finance team.
              This submits a brokerage funding notification; it does not collect
              a payment.
            </p>
          )}
          <label className="block text-sm">
            Amount
            <input
              required
              className="block w-full mt-1 rounded border-gray-300"
              type="number"
              min={deposit ? "0.01" : "1"}
              step={deposit ? "0.01" : "1"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          {!deposit && (
            <p className="text-xs text-gray-600">
              Use whole currency units; decimals are not rounded or truncated.
            </p>
          )}
          <label className="block text-sm">
            Currency
            <select
              className="block w-full mt-1 rounded border-gray-300"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option>USD</option>
              <option>NGN</option>
            </select>
          </label>
          {deposit && (
            <>
              <label className="block text-sm">
                Payment reference
                <input
                  required
                  className="block w-full mt-1 rounded border-gray-300"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  pattern="[A-Za-z0-9_-]+"
                />
              </label>
              <label className="block text-sm">
                Date received
                <input
                  required
                  type="date"
                  className="block w-full mt-1 rounded border-gray-300"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label className="flex gap-2 text-sm">
                <input
                  required
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                I have verified receipt of these funds against our payment
                records.
              </label>
            </>
          )}
        </fieldset>
        {error && (
          <p role="alert" className="p-3 bg-red-50 text-red-800">
            {error}
          </p>
        )}
        {unknown && (
          <p className="text-sm">
            Reference: {reference}. Check transaction activity before creating
            another request.
          </p>
        )}
        {rejected && (
          <button
            className="underline text-sm"
            type="button"
            onClick={() => {
              setRejected(false);
              setReference(uuid());
              setError("");
            }}
          >
            Start a corrected request
          </button>
        )}
        <button
          className="btn bg-wp-blue border-none w-full"
          disabled={busy || unknown || rejected}
        >
          {busy
            ? "Submitting…"
            : deposit
            ? "Submit verified deposit"
            : "Request withdrawal"}
        </button>
      </form>
    </ActionDialog>
  );
}

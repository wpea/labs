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
          : "Withdrawal requested. Track it in Withdrawals."
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
      title={deposit ? "Record received deposit" : "Withdraw Funds"}
      open={showDep}
      onClose={toggleAdd}
      busy={busy}
    >
      <form onSubmit={submit} className="space-y-6">
        <fieldset disabled={busy || unknown || rejected} className="space-y-4">
          {deposit && (
            <p className="text-sm text-gray-600">
              Record funds already received and verified by your finance team.
              This submits a brokerage funding notification; it does not collect
              a payment.
            </p>
          )}
          <label className="block text-xs space-y-3">
            Amount
            <input
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
              type="number"
              min={deposit ? "0.01" : "1"}
              step={deposit ? "0.01" : "1"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          {!deposit && (
            <p className="text-xs text-gray-600">Enter a whole-unit amount.</p>
          )}
          <label className="block text-xs space-y-3">
            Currency
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option>USD</option>
              <option>NGN</option>
            </select>
          </label>
          {deposit && (
            <>
              <label className="block text-xs space-y-3">
                Payment reference
                <input
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  pattern="[A-Za-z0-9_-]+"
                />
              </label>
              <label className="block text-xs space-y-3">
                Date received
                <input
                  required
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
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
            Reference: {reference}. Check Withdrawals before creating another
            request.
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
          className="btn flex w-36 justify-between border-none bg-green-600 capitalize hover:bg-green-700"
          disabled={busy || unknown || rejected}
        >
          {busy
            ? "Submitting…"
            : deposit
            ? "Submit verified deposit"
            : "Complete"}
        </button>
      </form>
    </ActionDialog>
  );
}

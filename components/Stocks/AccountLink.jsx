import { useState } from "react";
import { bamboo } from "../../lib/bamboo";
export default function AccountLink({ account, onLinked }) {
  const [id, setId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="m-6 p-6 border rounded-lg space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await bamboo(`/accounts/${account.id}/link`, {
            method: "POST",
            data: { bamboo_user_id: id, activation_confirmed: confirmed },
          });
          onLinked();
        } catch (e) {
          setError(e.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-xl font-bold">
        Connect this existing brokerage account
      </h2>
      <p className="text-sm text-gray-600">
        Enter the user ID from Bamboo’s reporting dashboard. The profile must
        match this account’s saved phone number or email.
      </p>
      <label className="block">
        Bamboo user ID
        <input
          className="block border rounded p-2 mt-1"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        Bamboo’s dashboard confirms this brokerage account is fully activated.
      </label>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <button className="btn bg-wp-blue border-none" disabled={busy}>
        {busy ? "Checking profile…" : "Connect account"}
      </button>
    </form>
  );
}

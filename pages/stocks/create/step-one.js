import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import AppLayout from "../../../components/Layouts/AppLayout";
import { bamboo, isCancelled } from "../../../lib/bamboo";

const basics = [
  "first_name",
  "last_name",
  "email",
  "phone_number",
  "date_of_birth",
  "gender",
  "citizenship",
  "country_code",
  "residence_country_code",
  "city",
  "province",
  "postal_code",
];
const investment = [
  "employment_status",
  "employment_type",
  "company",
  "position",
  "source_of_wealth",
  "yearly_income",
  "net_worth",
  "liquid",
  "marital_status",
  "goal",
  "experience",
  "risk_tolerance",
];
const title = (value) =>
  value.replaceAll("_", " ").replace(/^./, (s) => s.toUpperCase());
export default function Registration() {
  const router = useRouter();
  const [dictionary, setDictionary] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [unknown, setUnknown] = useState(false);
  const [basic, setBasic] = useState({
    country_code: "NGA",
    residence_country_code: "NGA",
    citizenship: "Nigerian",
    gender: "Man",
  });
  const [identity, setIdentity] = useState({ document_type: "BVN" });
  const [profile, setProfile] = useState({});
  const [broker, setBroker] = useState(false);
  const [director, setDirector] = useState("");
  const [verified, setVerified] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [extended, setExtended] = useState(false);
  const reference = useRef(uuid());
  const submitting = useRef(false);
  useEffect(() => {
    const c = new AbortController();
    bamboo("/dictionary", { signal: c.signal })
      .then(setDictionary)
      .catch((e) => {
        if (!isCancelled(e)) setError(e.message);
      });
    return () => c.abort();
  }, []);
  const choices = (field) => Object.assign({}, ...(dictionary?.[field] || []));
  async function image(field, file) {
    if (!file) return;
    if (
      file.size > 6 * 1024 * 1024 ||
      !["image/png", "image/jpeg"].includes(file.type)
    ) {
      setError("Use a PNG or JPEG image up to 6 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setIdentity((old) => ({ ...old, [field]: reader.result }));
    reader.readAsDataURL(file);
  }
  async function submit(e) {
    e.preventDefault();
    if (submitting.current || unknown) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    const body = {
      reference: reference.current,
      intent_to_deposit: deposit,
      identity_verified: verified,
      basic_info: basic,
      verified_identity_info: {
        ...identity,
        city: basic.city,
        date_of_birth: basic.date_of_birth,
        email: basic.email,
        full_name: `${basic.first_name} ${basic.last_name}`,
        gender: basic.gender,
        phone_number: basic.phone_number,
        residence_country: basic.residence_country_code,
        state: basic.province,
      },
      affiliation_info: { broker, director_of: director || null },
      brokerage_account_info: {
        ...profile,
        ...(extended ? { extended_hours_opt_in: "REQUESTED" } : {}),
      },
    };
    ["yearly_income", "net_worth", "liquid"].forEach(
      (k) => (body.brokerage_account_info[k] = Number(profile[k]))
    );
    try {
      const account = await bamboo("/accounts", { method: "POST", data: body });
      router.push(`/stocks/dashboard/account?account_id=${account.id}`);
    } catch (e) {
      setError(e.message);
      if (
        e.code === "outcome_unknown" ||
        !e.response ||
        e.response?.status >= 500
      )
        setUnknown(true);
      else if (e.code === "upstream_error" || e.code === "previously_rejected")
        reference.current = uuid();
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  const field = "block w-full mt-1 rounded border-gray-300 text-sm";
  return (
    <AppLayout>
      <main className="max-w-5xl mx-auto p-6 lg:py-12 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-wp-blue">
              Brokerage accounts
            </p>
            <h1 className="font-ibm text-3xl mt-2">Open a stock account</h1>
          </div>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => router.push("/stocks/dashboard")}
          >
            Accounts
          </button>
        </div>
        <p className="text-gray-600">
          Use verified identity information. Submit when the client is ready to
          make their first deposit. Brokerage activation is confirmed after
          Bamboo reviews the account.
        </p>
        {error && (
          <p role="alert" className="p-4 bg-red-50 text-red-800">
            {error}
          </p>
        )}
        {unknown && (
          <p className="p-4 bg-amber-50">
            Registration outcome needs reconciliation. Reference:{" "}
            {reference.current}. Check Bamboo’s reporting dashboard before
            submitting another registration.
          </p>
        )}
        <form onSubmit={submit} className="space-y-8">
          <fieldset
            disabled={busy || unknown || !dictionary}
            className="space-y-8"
          >
            <section className="border rounded-xl p-6 space-y-5">
              <h2 className="font-bold text-lg">Personal details</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {basics.map((k) => (
                  <label key={k} className="text-sm">
                    {title(k)}
                    {k === "gender" ? (
                      <select
                        className={field}
                        value={basic[k]}
                        onChange={(e) =>
                          setBasic({ ...basic, [k]: e.target.value })
                        }
                      >
                        <option>Man</option>
                        <option>Woman</option>
                      </select>
                    ) : (
                      <input
                        required
                        className={field}
                        type={
                          k === "date_of_birth"
                            ? "date"
                            : k === "email"
                            ? "email"
                            : "text"
                        }
                        value={basic[k] || ""}
                        placeholder={k === "phone_number" ? "+234…" : undefined}
                        onChange={(e) =>
                          setBasic({ ...basic, [k]: e.target.value })
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
            <section className="border rounded-xl p-6 space-y-5">
              <h2 className="font-bold text-lg">Verified identity</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  "document_type",
                  "identifier",
                  "address",
                  "expiration_date",
                ].map((k) => (
                  <label key={k} className="text-sm">
                    {title(k)}
                    {k === "expiration_date" ? " (where applicable)" : ""}
                    <input
                      required={k !== "expiration_date"}
                      type={k === "expiration_date" ? "date" : "text"}
                      className={field}
                      value={identity[k] || ""}
                      onChange={(e) =>
                        setIdentity({ ...identity, [k]: e.target.value })
                      }
                    />
                  </label>
                ))}
                {[
                  "image",
                  ...(["GHA", "ZAF"].includes(basic.residence_country_code)
                    ? ["front_id_image", "back_id_image"]
                    : []),
                ].map((k) => (
                  <label key={k} className="text-sm">
                    {k === "image" ? "Passport photograph" : title(k)}
                    <input
                      required
                      accept="image/png,image/jpeg"
                      type="file"
                      className="block mt-2"
                      onChange={(e) => image(k, e.target.files[0])}
                    />
                  </label>
                ))}
              </div>
              <label className="flex gap-2 text-sm">
                <input
                  required
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                I confirm these identity details have been independently
                verified.
              </label>
            </section>
            <section className="border rounded-xl p-6 space-y-5">
              <h2 className="font-bold text-lg">Investment profile</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {investment.map((k) => {
                  const options = choices(
                    ["yearly_income", "net_worth", "liquid"].includes(k)
                      ? "assets_range"
                      : k
                  );
                  return (
                    <label key={k} className="text-sm">
                      {title(k)}
                      {Object.keys(options).length ? (
                        <select
                          required
                          className={field}
                          value={profile[k] || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, [k]: e.target.value })
                          }
                        >
                          <option value="">Select…</option>
                          {Object.entries(options).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          required
                          className={field}
                          value={profile[k] || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, [k]: e.target.value })
                          }
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
            <section className="border rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Affiliations and readiness</h2>
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={broker}
                  onChange={(e) => setBroker(e.target.checked)}
                />
                Client is affiliated with a broker or dealer
              </label>
              <label className="block text-sm">
                Public company directorships (company and ticker, if any)
                <input
                  className={field}
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                />
              </label>
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={extended}
                  onChange={(e) => setExtended(e.target.checked)}
                />
                Request extended-hours trading
              </label>
              <label className="flex gap-2 text-sm">
                <input
                  required
                  type="checkbox"
                  checked={deposit}
                  onChange={(e) => setDeposit(e.target.checked)}
                />
                The client is ready to make their first deposit
              </label>
            </section>
            <button className="btn bg-wp-blue border-none">
              {busy
                ? "Submitting account…"
                : !dictionary
                ? "Loading profile choices…"
                : "Submit brokerage application"}
            </button>
          </fieldset>
        </form>
      </main>
    </AppLayout>
  );
}

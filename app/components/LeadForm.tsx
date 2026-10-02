"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type LeadFormValues = {
  name: string;
  mobile: string;
  email: string;
  company: string;
  source: string;
  status: string;
  notes: string;
  followUpDate: string;
};

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "INTERESTED", label: "Interested" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const SOURCES = ["Website", "Referral", "Social Media", "Cold Call", "Walk-in", "Other"];

const emptyValues: LeadFormValues = {
  name: "",
  mobile: "",
  email: "",
  company: "",
  source: "Website",
  status: "NEW",
  notes: "",
  followUpDate: "",
};

export default function LeadForm({
  initial,
  leadId,
}: {
  initial?: LeadFormValues;
  leadId?: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState<LeadFormValues>(initial ?? emptyValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof LeadFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(leadId ? `/api/leads/${leadId}` : "/api/leads", {
        method: leadId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save nahi ho paya");
        return;
      }
      router.push("/leads");
      router.refresh();
    } catch {
      setError("Network error, dobara try karo");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const label = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl bg-white rounded-xl border border-gray-200 p-5 space-y-4"
    >
      {error && (
        <div className="rounded-md bg-red-50 text-red-700 text-sm p-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Name *</label>
          <input className={input} value={values.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label className={label}>Mobile *</label>
          <input className={input} value={values.mobile} onChange={(e) => update("mobile", e.target.value)} />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input type="email" className={input} value={values.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className={label}>Company</label>
          <input className={input} value={values.company} onChange={(e) => update("company", e.target.value)} />
        </div>
        <div>
          <label className={label}>Lead Source *</label>
          <select className={input} value={values.source} onChange={(e) => update("source", e.target.value)}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Status *</label>
          <select className={input} value={values.status} onChange={(e) => update("status", e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Follow-up Date</label>
          <input type="date" className={input} value={values.followUpDate} onChange={(e) => update("followUpDate", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={label}>Notes</label>
        <textarea rows={4} className={input} value={values.notes} onChange={(e) => update("notes", e.target.value)} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : leadId ? "Update Lead" : "Save Lead"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/leads")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
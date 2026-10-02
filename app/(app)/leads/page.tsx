"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  company: string | null;
  source: string;
  status: string;
  followUpDate: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "INTERESTED", label: "Interested" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  INTERESTED: "bg-purple-100 text-purple-700",
  FOLLOW_UP: "bg-orange-100 text-orange-700",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

function statusLabel(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error();
      setLeads(await res.json());
    } catch {
      setError("Leads load nahi ho paye. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(loadLeads, 300);
    return () => clearTimeout(t);
  }, [loadLeads]);

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Kya aap "${name}" ko delete karna chahte ho?`)) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete nahi ho paya");
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Link
          href="/leads/new"
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium text-center hover:bg-blue-700"
        >
          + Add Lead
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, mobile, company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 text-sm p-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading leads...</p>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-700 font-medium">Koi lead nahi mili</p>
          <p className="text-gray-500 text-sm mt-1">
            {search || status
              ? "Search ya filter badal ke dekho."
              : "Pehli lead add karke shuru karo."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3">{lead.mobile}</td>
                  <td className="px-4 py-3">{lead.company || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        STATUS_COLORS[lead.status] ?? "bg-gray-100"
                      }`}
                    >
                      {statusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {lead.followUpDate
                      ? new Date(lead.followUpDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap space-x-3">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/leads/${lead.id}/edit`}
                      className="text-gray-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(lead.id, lead.name)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/followups", label: "Follow-ups" },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <span className="font-bold">Lead CRM</span>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm border border-gray-600 rounded px-3 py-1"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} md:flex md:flex-col md:w-60 md:min-h-screen bg-gray-900 text-white p-4 space-y-4`}
      >
        <div className="hidden md:block text-xl font-bold">Lead CRM</div>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm ${
                pathname.startsWith(l.href) ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="md:mt-auto space-y-2">
          <p className="text-xs text-gray-400 break-all">{email}</p>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
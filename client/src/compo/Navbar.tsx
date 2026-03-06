"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">MyApp</h1>
      <div className="space-x-4">
        <Link href="/register" className="bg-blue-600 px-4 py-2 rounded">
          Add User
        </Link>
        <Link href="/dashboard">Dashboard</Link>
        {/* <Link href="/blog">Add Blog</Link> */}
      </div>
    </nav>
  );
}
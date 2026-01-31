"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import SearchBar from "./searchbar";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);

  if (!isLoaded || !user) return null;

  const initials =
    user.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white border-b border-zinc-800">
      {/* Logo */}
      <Link href="/dashboard">
        <h1 className="text-xl font-bold text-red-600 cursor-pointer">
          MyFlix
        </h1>
      </Link>

      {/* Search */}
      <SearchBar />

      {/* Avatar + Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full cursor-pointer border border-zinc-700"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold cursor-pointer">
            {initials}
          </div>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded shadow-lg text-sm z-50">
            <div className="px-4 py-2 border-b border-zinc-700">
              <p className="font-semibold truncate">
                {user.fullName}
              </p>
            </div>

            <Link
              href="/subscribe"
              className="block px-4 py-2 hover:bg-zinc-800"
            >
              Subscribe
            </Link>

            <Link
              href="/party"
              className="block px-4 py-2 hover:bg-zinc-800"
            >
              Watch Party
            </Link>

            <div className="px-4 py-2 hover:bg-zinc-800 cursor-pointer">
              <SignOutButton>
                <span>Logout</span>
              </SignOutButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

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
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-gray-800/50">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-2xl">🎬</span>
        <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          StreamView
        </h1>
      </Link>

      {/* Search */}
      <SearchBar />

      {/* Avatar + Dropdown */}
      <div
        className="relative"
        onClick={() => setOpen(!open)}
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-red-500 transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform">
            {initials}
          </div>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-gray-800 bg-gray-900">
              <p className="font-semibold truncate">{user.fullName}</p>
              <p className="text-sm text-gray-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>

            <div className="py-2">
              <Link
                href="/subscribe"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
              >
                <span>⭐</span>
                <span>Go Premium</span>
              </Link>

              <Link
                href="/party"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
              >
                <span>🎉</span>
                <span>Watch Party</span>
              </Link>
            </div>

            <div className="border-t border-gray-800 py-2">
              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors text-red-400">
                <SignOutButton>
                  <span className="flex items-center gap-3">
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </span>
                </SignOutButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

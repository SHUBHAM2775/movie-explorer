"use client";
// Navbar component skeleton
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import EditProfileModal from "./EditProfileModal";
import SearchBar from "./SearchBar";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { setSearchQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`w-full flex items-center justify-between px-8 py-4 shadow-md transition-all duration-300 ${theme === "dark" ? "bg-black text-yellow-400" : "bg-white text-yellow-500"}`}>
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-2xl cursor-pointer flex items-center">
            <span className="inline-block align-middle mr-2">
              {/* Movie icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="3" fill="#FFD600"/>
                <rect x="2" y="4" width="20" height="16" rx="3" fillOpacity="0.1"/>
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="#FFD600" strokeWidth="2"/>
                <circle cx="7" cy="8" r="1" fill="#A259FF"/>
                <circle cx="12" cy="8" r="1" fill="#A259FF"/>
                <circle cx="17" cy="8" r="1" fill="#A259FF"/>
              </svg>
            </span>
            <span className="font-bold text-yellow-400">Movie</span>
            <span className="font-bold text-purple-400">Explorer</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-xl">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>
      <div className="flex items-center gap-4 relative">
        <button
          onClick={toggleTheme}
          className={`px-3 py-2 rounded transition ${theme === "dark" ? "bg-yellow-400 text-black" : "bg-yellow-500 text-white"}`}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        {loading ? null : user ? (
          <div className="relative">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded transition-all shadow cursor-pointer"
              onClick={() => setDropdown((d) => !d)}
            >
              {user.name || (user.email ? user.email.split("@")[0] : "User")}
            </button>
            {dropdown && (
              <div className={`absolute right-0 mt-2 w-40 rounded shadow-lg z-10 flex flex-col ${theme === "dark" ? "bg-black text-yellow-400" : "bg-white text-gray-800"}`}>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-yellow-100 ${theme === "dark" ? "hover:bg-yellow-900" : ""}`}
                  onClick={() => { setEditProfileOpen(true); setDropdown(false); }}
                >
                  Edit Profile
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-yellow-100 ${theme === "dark" ? "hover:bg-yellow-900" : ""}`}
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </div>
            )}
            <EditProfileModal isOpen={editProfileOpen} onClose={() => setEditProfileOpen(false)} />
          </div>
        ) : (
          <Link href="/auth/login">
            <button className={`bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded transition-all shadow cursor-pointer`}>
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

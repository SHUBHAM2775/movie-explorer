"use client";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSession } from "next-auth/react";

export default function EditProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { update } = useSession();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully.");
        // Use NextAuth's update method to refresh session so updated name appears in navbar
        if (typeof update === "function") {
          await update();
        }
        // Close modal after successful update
        onClose();
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch {
      setMessage("Failed to update profile.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gradient-to-br from-[#18122B] to-[#23213A] p-6 rounded-lg shadow-2xl w-80 border border-[#FFD600]">
        <h2 className="text-xl font-bold mb-4 text-yellow-400 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-[#FFD600] bg-[#23213A] text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-[#FFD600] bg-[#23213A] text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <label className="text-sm text-gray-300">New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-[#A259FF] bg-[#23213A] text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Leave blank to keep current"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded mt-2 transition-all"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {message && <div className="text-center text-sm mt-2 text-yellow-300">{message}</div>}
        </form>
        <button
          className="mt-4 text-xs text-gray-400 hover:underline w-full text-center"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

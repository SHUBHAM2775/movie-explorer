
"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "../../components/AuthModal";

export default function RegisterPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleAuth = async (data: { email: string; password: string; name?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");
      alert("Registration successful! Please login.");
      setOpen(false);
      router.push("/auth/login");
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        alert((err as { message?: string }).message);
      } else {
        alert('An error occurred');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#18122B] to-[#1E1E2F]">
      <div className="w-full max-w-md p-4">
        {open && (
          <div className="rounded-lg shadow-lg bg-[#23213A] p-6">
            <AuthModal
              mode="register"
              onClose={handleClose}
              onAuth={handleAuth}
              switchMode={() => router.push("/auth/login")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

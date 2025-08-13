
"use client";



import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "../../components/AuthModal";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleAuth = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) throw new Error(res.error);
      setOpen(false);
      router.push("/");
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
              mode="login"
              onClose={handleClose}
              onAuth={handleAuth}
              switchMode={() => router.push("/auth/register")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

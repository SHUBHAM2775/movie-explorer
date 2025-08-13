import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data, status } = useSession();
  const user = data?.user ?? null;
  const loading = status === "loading";
  return {
    user,
    loading,
    login: signIn,
    logout: signOut,
  };
}

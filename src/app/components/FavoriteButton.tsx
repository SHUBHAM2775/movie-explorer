// FavoriteButton component skeleton
import { useAuth } from "../hooks/useAuth";

export default function FavoriteButton() {
  const { user } = useAuth();
  return (
    <>
      <button disabled={!user} title={!user ? 'Sign in to manage favorites' : undefined}>Favorite</button>
      {!user && <div className="text-xs text-yellow-400 mt-1">Sign in to use favorites.</div>}
    </>
  );
}

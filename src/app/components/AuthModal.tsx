import Link from "next/link";


import React, { useState } from "react";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onAuth: (data: { email: string; password: string; name?: string }) => void;
  switchMode: () => void;
}


const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onAuth, switchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (mode === "register") {
        await onAuth({ name, email, password });
        setMessage("Registration successful! You can now log in.");
      } else {
        await onAuth({ email, password });
        setMessage("");
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        setMessage((err as { message?: string }).message || "Something went wrong.");
      } else {
        setMessage("Something went wrong.");
      }
    }
    setLoading(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">&times;</button>
        <h2 className={styles.title}>
          <span className={styles.gradientText}>
            {mode === "login" ? "Welcome Back" : "Join MovieExplorer"}
          </span>
        </h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {mode === "register" && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          )}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-2v-2a6 6 0 10-12 0v2a2 2 0 002 2h8a2 2 0 002-2z"/></svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path d="M17.94 17.94A10.06 10.06 0 0112 20c-5.52 0-10-4.48-10-10 0-2.21.72-4.25 1.94-5.94M6.34 6.34A7.96 7.96 0 004 12c0 4.42 3.58 8 8 8 1.85 0 3.55-.63 4.9-1.69M1 1l22 22" />
                  ) : (
                    <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12zm0 0l22 0" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (mode === "login" ? "Signing In..." : "Registering...") : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
          {message && (
            <div style={{ marginTop: 12, textAlign: 'center', color: message.includes('success') ? '#FFD600' : '#ff4d4f', fontWeight: 500 }}>
              {message}
            </div>
          )}
        </form>
        <div className={styles.switchMode}>
          {mode === "login" ? (
            <>
              <span>Don&apos;t have an account?</span>
              <button type="button" onClick={switchMode} className={styles.switchButton}>
                Create Account
              </button>
              <div style={{ marginTop: 8 }}>
                {/* Use Next.js Link for navigation */}
                {/* Forgot Password link removed */}
              </div>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button type="button" onClick={switchMode} className={styles.switchButton}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { serverMessage } from "../api/axios";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(username, email, password);
      navigate("/products");
    } catch (err) {
      setError(serverMessage(err, "Registration failed. Try a different email."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container account-shell">
      <div className="account-panel">
          <h1>Make room for good finds.</h1>
          <p className="text-secondary">Create an account to save your cart and follow your orders.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="regUsername">Username</label>
              <input id="regUsername" type="text" className="form-control" required value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="regEmail">Email</label>
              <input id="regEmail" type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="regPassword">Password (at least 6 characters)</label>
              <input id="regPassword" type="password" className="form-control" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <button type="submit" className="btn btn-primary w-100 tap-target" disabled={busy}>
              {busy ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="mt-3">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </main>
  );
}

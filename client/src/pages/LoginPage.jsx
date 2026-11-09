import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { serverMessage } from "../api/axios";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(email, password);
      navigate(user.usertype === "admin" ? "/admin" : "/products");
    } catch (err) {
      setError(serverMessage(err, "Login failed. Check your email and password."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container account-shell">
      <div className="account-panel">
          <h1>Welcome back.</h1>
          <p className="text-secondary">Sign in to pick up where you left off.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="loginEmail">Email</label>
              <input id="loginEmail" type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="loginPassword">Password</label>
              <input id="loginPassword" type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary w-100 tap-target" disabled={busy}>
              {busy ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-3 mb-1">New to ShopEZ? <Link to="/register">Create an account</Link></p>
          <p className="text-secondary small mt-4">
            After running the seed script you can use customer@shopez.in / customer123
            or admin@shopez.in / admin123.
          </p>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import api, { serverMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StateBlock";
import { formatINR, formatDate } from "../utils/format";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [username, setUsername] = useState(user ? user.username : "");
  const [notice, setNotice] = useState("");

  async function load() {
    setState("loading");
    try {
      const { data } = await api.get("/orders/mine");
      setOrders(data);
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load your orders."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveName(e) {
    e.preventDefault();
    setNotice("");
    try {
      const { data } = await api.put("/users/profile", { username });
      localStorage.setItem("shopez_user", JSON.stringify(data));
      setUser(data);
      setNotice("Your name was saved.");
    } catch (err) {
      setError(serverMessage(err, "Could not save your name."));
    }
  }

  return (
    <main className="container py-4">
      <div className="profile-header">
        <div>
          <h1>Your account</h1>
          <p className="text-secondary mb-0">Manage your details and keep an eye on deliveries.</p>
        </div>
        <form onSubmit={saveName} className="account-panel profile-edit">
          <h2 className="h4">Personal details</h2>
          <div className="mb-3">
            <label className="form-label" htmlFor="profileName">Username</label>
            <input id="profileName" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <p className="mb-3">Email: {user.email}<br />Account type: {user.usertype}</p>
          <button type="submit" className="btn btn-primary tap-target">Save name</button>
        </form>
      </div>
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {error && state === "ready" && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="profile-orders" aria-labelledby="orders-title">
      <h2 id="orders-title" className="h2 mb-4">Your orders</h2>
      {state === "loading" && <LoadingBlock label="Loading your orders..." />}
      {state === "error" && <ErrorBlock message={error} onRetry={load} />}
      {state === "ready" && orders.length === 0 && (
        <EmptyBlock message="You have not placed an order yet. Orders you place will be listed here with their delivery date." />
      )}
      {state === "ready" && orders.length > 0 && (
        <div className="d-grid gap-3">
          {orders.map((o) => (
            <article className="card profile-order" key={o._id}>
              <div className="card-body">
                <h3 className="h6 card-title">
                  Order {o._id} <span className="badge text-bg-secondary">{o.status}</span>
                </h3>
                <p className="mb-1">
                  Placed on {formatDate(o.orderDate)}. Delivery by {formatDate(o.deliveryDate)}.
                  Payment: {o.paymentMethod}. Final price: <strong>{formatINR(o.finalPrice)}</strong>
                </p>
                <ul className="mb-0">
                  {o.items.map((i, idx) => (
                    <li key={idx}>{i.title}{i.size ? " (Size " + i.size + ")" : ""} x {i.quantity}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
      </section>
    </main>
  );
}

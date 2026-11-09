import { useEffect, useState } from "react";
import api, { serverMessage } from "../../api/axios";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/StateBlock";
import { formatINR, formatDate } from "../../utils/format";

const STATUSES = ["Placed", "Shipped", "Delivered", "Cancelled"];

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  async function load() {
    setState("loading");
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load orders."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(order, status) {
    setError("");
    try {
      const { data } = await api.patch("/orders/" + order._id + "/status", { status });
      setOrders((list) => list.map((o) => (o._id === data._id ? data : o)));
    } catch (err) {
      setError(serverMessage(err, "Could not update the order status."));
    }
  }

  return (
    <main className="container admin-shell">
      <header className="admin-header">
        <div>
          <h1>Order desk</h1>
          <p>Review delivery details and update each order's current status.</p>
        </div>
      </header>
      {error && state === "ready" && <div className="alert alert-danger" role="alert">{error}</div>}
      {state === "loading" && <LoadingBlock label="Loading orders..." />}
      {state === "error" && <ErrorBlock message={error} onRetry={load} />}
      {state === "ready" && orders.length === 0 && (
        <EmptyBlock message="No orders have been placed yet." />
      )}
      {state === "ready" && orders.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">Order date</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Final price</th>
                <th scope="col">Payment</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{formatDate(o.orderDate)}</td>
                  <td>{o.name}<br /><span className="text-secondary small">{o.email}, {o.mobile}<br />{o.address}, {o.pincode}</span></td>
                  <td>
                    {o.items.map((i, idx) => (
                      <div key={idx}>{i.title}{i.size ? " (" + i.size + ")" : ""} x {i.quantity}</div>
                    ))}
                  </td>
                  <td>{formatINR(o.finalPrice)}</td>
                  <td>{o.paymentMethod}</td>
                  <td>
                    <label className="visually-hidden" htmlFor={"status-" + o._id}>Status for order {o._id}</label>
                    <select
                      id={"status-" + o._id}
                      className="form-select"
                      value={o.status}
                      onChange={(e) => changeStatus(o, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

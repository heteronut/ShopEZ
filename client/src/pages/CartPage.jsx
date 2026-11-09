import { useState } from "react";
import { Link } from "react-router-dom";
import api, { serverMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import PriceDetails from "../components/PriceDetails";
import { EmptyBlock } from "../components/StateBlock";
import { formatINR, discountedPrice, formatDate } from "../utils/format";

export default function CartPage() {
  const { user } = useAuth();
  const { items, setItems, refresh } = useCart();
  const [form, setForm] = useState({
    name: user ? user.username : "",
    email: user ? user.email : "",
    mobile: "",
    address: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function changeQty(item, quantity) {
    setError("");
    try {
      const { data } = await api.put("/cart", { productId: item.productId, size: item.size, quantity });
      setItems(data.items);
    } catch (err) {
      setError(serverMessage(err, "Could not update the quantity."));
    }
  }

  async function removeItem(item) {
    setError("");
    try {
      const { data } = await api.delete("/cart/" + item.productId + "?size=" + encodeURIComponent(item.size || ""));
      setItems(data.items);
    } catch (err) {
      setError(serverMessage(err, "Could not remove the item."));
    }
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/orders", form);
      setPlaced(data);
      await refresh();
    } catch (err) {
      setError(serverMessage(err, "The order could not be placed."));
    } finally {
      setBusy(false);
    }
  }

  if (placed) {
    return (
      <main className="container py-4">
        <h1 className="h2 mb-4">Order confirmed</h1>
        <div className="alert alert-success" role="status">
          Order {placed._id} was placed on {formatDate(placed.orderDate)}. Expected delivery by {formatDate(placed.deliveryDate)}.
        </div>
        <ul className="list-group mb-3">
          {placed.items.map((i, idx) => (
            <li className="list-group-item d-flex justify-content-between" key={idx}>
              <span>{i.title}{i.size ? " (Size " + i.size + ")" : ""} x {i.quantity}</span>
              <span>{formatINR(discountedPrice(i.price, i.discount) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p>Final order total: <strong>{formatINR(placed.finalPrice)}</strong>. Payment method recorded: {placed.paymentMethod}.</p>
        <p className="text-secondary">This demo records the selected method; it does not process a payment.</p>
        <Link className="btn btn-primary tap-target" to="/profile">View this order in your profile</Link>
      </main>
    );
  }

  return (
    <main className="container py-4 cart-page">
      <h1 className="h2 mb-4">Your cart</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {items.length === 0 ? (
        <>
          <EmptyBlock message="Your cart is empty. Nothing has been added yet." />
          <Link className="btn btn-primary mt-3 tap-target" to="/products">Browse products</Link>
        </>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <ul className="list-group mb-4">
              {items.map((item, idx) => (
                <li className="list-group-item" key={idx}>
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <div>
                      <strong>{item.title}</strong>
                      {item.size && <span> (Size {item.size})</span>}
                      <br />
                      <span>{formatINR(discountedPrice(item.price, item.discount))} each</span>
                      {item.discount > 0 && <span className="discount-text"> ({item.discount}% off)</span>}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <label className="visually-hidden" htmlFor={"qty-" + idx}>Quantity for {item.title}</label>
                      <input
                        id={"qty-" + idx}
                        type="number"
                        min="0"
                        className="form-control"
                        style={{ width: 80 }}
                        value={item.quantity}
                        onChange={(e) => changeQty(item, Number(e.target.value))}
                      />
                      <button type="button" className="btn btn-outline-danger btn-sm tap-target" onClick={() => removeItem(item)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="checkout-section-title">Delivery and payment</h2>
            <form onSubmit={placeOrder}>
              <div className="mb-3">
                <label className="form-label" htmlFor="coName">Receiver name</label>
                <input id="coName" className="form-control" required value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="coEmail">Email</label>
                  <input id="coEmail" type="email" className="form-control" required value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="coMobile">Mobile number (10 digits)</label>
                  <input id="coMobile" className="form-control" required pattern="[0-9]{10}" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="coAddress">Delivery address</label>
                <textarea id="coAddress" className="form-control" rows="2" required value={form.address} onChange={(e) => set("address", e.target.value)}></textarea>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="coPincode">Pincode (6 digits)</label>
                  <input id="coPincode" className="form-control" required pattern="[0-9]{6}" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="coPayment">Payment method</label>
                  <select id="coPayment" className="form-select" value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)}>
                    <option>Cash on Delivery</option>
                    <option>UPI</option>
                    <option>Card</option>
                  </select>
                </div>
              </div>
              <p className="small text-secondary">This demo records your selected payment method only. No payment gateway or card-number collection is connected.</p>
              <button type="submit" className="btn btn-primary tap-target" disabled={busy}>
                {busy ? "Placing order..." : "Place Order"}
              </button>
            </form>
          </div>
          <div className="col-12 col-lg-5">
            <PriceDetails items={items} />
          </div>
        </div>
      )}
    </main>
  );
}

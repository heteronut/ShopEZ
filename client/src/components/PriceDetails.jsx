import { formatINR, discountedPrice } from "../utils/format";

// Mirrors the server pricing rules in server/utils/pricing.js so the customer
// sees the same numbers the server will charge. The server recomputes them
// when the order is placed; this panel is a preview, not the source of truth.
export default function PriceDetails({ items }) {
  const totalMrp = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const payable = items.reduce((s, i) => s + discountedPrice(i.price, i.discount) * i.quantity, 0);
  const discountAmount = totalMrp - payable;
  const deliveryFee = items.length === 0 || payable >= 999 ? 0 : 49;
  return (
    <div className="card price-summary">
      <div className="card-body">
        <h2 className="h5 card-title">Price Details</h2>
        <dl className="row mb-0">
          <dt className="col-7 fw-normal">Total MRP</dt>
          <dd className="col-5 text-end">{formatINR(totalMrp)}</dd>
          <dt className="col-7 fw-normal">Discount</dt>
          <dd className="col-5 text-end">{formatINR(discountAmount)}</dd>
          <dt className="col-7 fw-normal">Delivery</dt>
          <dd className="col-5 text-end">{deliveryFee === 0 ? "Free" : formatINR(deliveryFee)}</dd>
          <dt className="col-7 border-top pt-2">Final Price</dt>
          <dd className="col-5 text-end border-top pt-2"><strong>{formatINR(payable + deliveryFee)}</strong></dd>
        </dl>
        <p className="small text-secondary mb-0 mt-2">Delivery is free on orders of {formatINR(999)} or more after discount.</p>
      </div>
    </div>
  );
}

// Single source of truth for order money math. The server always recomputes
// prices from the database; numbers sent by the client are never trusted.
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 49;

function discountedUnitPrice(price, discount) {
  return Math.round(price - (price * discount) / 100);
}

function computePriceDetails(items) {
  // items: [{ price, discount, quantity }] with price = MRP per unit in INR
  let totalMrp = 0;
  let payableForItems = 0;
  for (const item of items) {
    totalMrp += item.price * item.quantity;
    payableForItems += discountedUnitPrice(item.price, item.discount) * item.quantity;
  }
  const discountAmount = totalMrp - payableForItems;
  const deliveryFee = items.length === 0 || payableForItems >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return {
    totalMrp,
    discountAmount,
    deliveryFee,
    finalPrice: payableForItems + deliveryFee,
  };
}

module.exports = { computePriceDetails, discountedUnitPrice, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE };

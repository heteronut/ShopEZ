import { useState } from "react";

const PHOTO_IDS = {
  Mobiles: "607812",
  Electronics: "3394650",
  Fashion: "994523",
  "Sports-Equipment": "3837757",
  Groceries: "4110256",
};

function photoFor(product) {
  const title = product.title.toLowerCase();
  if (title.includes("headphone")) return "3394650";
  if (title.includes("television") || title.includes("tv")) return "1444416";
  if (title.includes("watch")) return "190819";
  if (title.includes("yoga")) return "3822622";
  return PHOTO_IDS[product.category] || PHOTO_IDS.Electronics;
}

export default function ProductArtwork({ product, large = false }) {
  const [unavailable, setUnavailable] = useState(false);
  const photoId = photoFor(product);
  const src = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=900`;

  return (
    <div
      className={`product-artwork${large ? " product-artwork--large" : ""}`}
      data-category={product.category}
    >
      {!unavailable ? (
        <img
          src={src}
          alt={`Illustrative photo for ${product.title}; not the exact product.`}
          loading={large ? "eager" : "lazy"}
          onError={() => setUnavailable(true)}
        />
      ) : (
        <div className="product-artwork__fallback" role="img" aria-label={`Illustrative photo unavailable for ${product.title}`}>
          <span>{product.category}</span>
          <span>Illustrative image unavailable</span>
        </div>
      )}
      {!unavailable && <span className="product-artwork__label">Illustrative photo · not exact item</span>}
    </div>
  );
}

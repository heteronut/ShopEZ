import { Link } from "react-router-dom";
import { formatINR, discountedPrice } from "../utils/format";
import ProductArtwork from "./ProductArtwork";

export default function ProductCard({ product }) {
  const finalPrice = discountedPrice(product.price, product.discount);
  return (
    <article className="product-card h-100">
      <ProductArtwork product={product} />
      <div className="product-card__body">
        <p className="product-card__category">{product.category.replace("-", " ")}</p>
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__price">
          <strong>{formatINR(finalPrice)}</strong>{" "}
          {product.discount > 0 && (
            <>
              <span className="product-card__mrp">{formatINR(product.price)}</span>{" "}
              <span className="discount-text">{product.discount}% off</span>
            </>
          )}
        </p>
        <p className="product-card__reviews">
          {product.numReviews > 0
            ? "Rated " + product.rating.toFixed(1) + " from " + product.numReviews + " review" + (product.numReviews > 1 ? "s" : "")
            : "No reviews yet"}
        </p>
        <p className="product-card__stock">{product.stock > 0 ? product.stock + " in stock" : "Out of stock"}</p>
        <Link className="btn btn-primary tap-target product-card__action" to={"/products/" + product._id} aria-label={"View " + product.title}>
          View product
        </Link>
      </div>
    </article>
  );
}

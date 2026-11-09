import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { serverMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatINR, discountedPrice, formatDate } from "../utils/format";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StateBlock";
import ProductArtwork from "../components/ProductArtwork";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { refresh } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function load() {
    setState("loading");
    try {
      const { data } = await api.get("/products/" + id);
      setProduct(data);
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load this product."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function addToCart(goToCart) {
    setNotice("");
    setActionError("");
    if (product.sizes.length > 0 && !size) {
      setActionError("Choose a size before adding this item to your cart.");
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/cart", { productId: id, size, quantity: Number(quantity) });
      await refresh();
      if (goToCart) navigate("/cart");
      else setNotice("Added to your cart.");
    } catch (err) {
      setActionError(serverMessage(err, "Could not add this product to the cart."));
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setActionError("");
    try {
      const { data } = await api.post("/products/" + id + "/reviews", { rating: Number(rating), comment });
      setProduct(data);
      setComment("");
      setNotice("Your review was saved.");
    } catch (err) {
      setActionError(serverMessage(err, "Could not save your review."));
    }
  }

  if (state === "loading") {
    return (
      <main className="container py-4">
        <LoadingBlock label="Loading product..." />
      </main>
    );
  }
  if (state === "error") {
    return (
      <main className="container py-4">
        <ErrorBlock message={error} onRetry={load} />
      </main>
    );
  }

  const finalPrice = discountedPrice(product.price, product.discount);
  return (
    <main className="container py-4">
      <nav aria-label="Breadcrumb" className="mb-4 small">
        <Link to="/products">Products</Link> <span aria-hidden="true">/</span> {product.category.replace("-", " ")}
      </nav>
      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-5">
          <ProductArtwork product={product} large />
        </div>
        <div className="col-12 col-md-7 product-detail__info">
          <p className="product-card__category">{product.category.replace("-", " ")}</p>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p className="product-detail__price">
            <strong>{formatINR(finalPrice)}</strong>{" "}
            {product.discount > 0 && (
              <>
                <del>{formatINR(product.price)}</del>{" "}
                <span className="discount-text">{product.discount}% off</span>
              </>
            )}
          </p>
          <p className={product.stock > 0 ? "product-stock" : "product-stock product-stock--empty"}>
            {product.stock > 0 ? product.stock + " in stock" : "Out of stock"}
          </p>
          <p className="text-secondary">
            {product.numReviews > 0
              ? "Rated " + product.rating.toFixed(1) + " from " + product.numReviews + " review" + (product.numReviews > 1 ? "s" : "")
              : "No reviews yet. Buyers can add the first one below."}
          </p>

          <form className="product-purchase" onSubmit={(e) => e.preventDefault()}>
            {product.sizes.length > 0 && (
              <div className="mb-3">
                <label className="form-label" htmlFor="sizeSelect">Size</label>
                <select id="sizeSelect" className="form-select" required value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="">Choose a size</option>
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-3 product-purchase__quantity">
              <label className="form-label" htmlFor="qtyInput">Quantity</label>
              <input
                id="qtyInput"
                type="number"
                min="1"
                max={product.stock}
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            {notice && <div className="alert alert-success" role="status">{notice}</div>}
            {actionError && <div className="alert alert-danger" role="alert">{actionError}</div>}
            <div className="d-flex gap-2 flex-wrap">
              <button type="button" className="btn btn-outline-success tap-target" disabled={product.stock === 0} onClick={() => addToCart(false)}>
                Add to Cart
              </button>
              <button type="button" className="btn btn-primary tap-target" disabled={product.stock === 0} onClick={() => addToCart(true)}>
                Buy Now
              </button>
            </div>
          </form>
        </div>
      </div>

      <section className="reviews-section" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Customer reviews</h2>
      {product.reviews.length === 0 ? (
        <EmptyBlock message="No reviews yet for this product." />
      ) : (
        <ul className="list-group mb-4">
          {product.reviews.map((r, idx) => (
            <li className="list-group-item" key={idx}>
              <strong>{r.username}</strong> rated it {r.rating} of 5
              <span className="text-secondary"> on {formatDate(r.createdAt)}</span>
              <br />
              {r.comment}
            </li>
          ))}
        </ul>
      )}
      {user ? (
        <form onSubmit={submitReview} className="col-12 col-md-6 px-0">
          <div className="mb-3">
            <label className="form-label" htmlFor="ratingSelect">Your rating</label>
            <select id="ratingSelect" className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} of 5</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="commentInput">Your review</label>
            <textarea
              id="commentInput"
              className="form-control"
              rows="3"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you buy it for, and did it do that job?"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary tap-target">Save review</button>
        </form>
      ) : (
        <p>Log in to write a review.</p>
      )}
      </section>
    </main>
  );
}

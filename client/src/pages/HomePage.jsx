import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { serverMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StateBlock";
import ProductArtwork from "../components/ProductArtwork";
import { formatINR, discountedPrice } from "../utils/format";

const CATEGORIES = ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"];

function FeaturedAddToCart({ product }) {
  const { user } = useAuth();
  const { refresh } = useCart();
  const navigate = useNavigate();
  const [size, setSize] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function addToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (product.sizes.length > 0 && !size) {
      setError("Choose a size before adding this item to your cart.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.post("/cart", { productId: product._id, size, quantity: 1 });
      await refresh();
      setNotice("Added to your cart.");
    } catch (err) {
      setError(serverMessage(err, "Could not add this product to the cart."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={"showroom-hero__purchase" + (product.sizes.length > 0 ? " showroom-hero__purchase--sized" : "")}>
      {product.sizes.length > 0 && (
        <div>
          <label className="visually-hidden" htmlFor="featuredSize">Choose a size</label>
          <select
            id="featuredSize"
            className="form-select"
            value={size}
            onChange={(event) => {
              setSize(event.target.value);
              setError("");
            }}
          >
            <option value="">Choose a size</option>
            {product.sizes.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary tap-target"
        disabled={busy || product.stock === 0 || (product.sizes.length > 0 && !size)}
        onClick={addToCart}
      >
        {product.stock === 0 ? "Out of stock" : busy ? "Adding..." : "Add to cart"}
      </button>
      {error && <span className="showroom-hero__message" role="alert">{error}</span>}
      {notice && <span className="showroom-hero__message" role="status">{notice}</span>}
    </div>
  );
}

export default function HomePage() {
  const [banner, setBanner] = useState("");
  const [deals, setDeals] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  async function load() {
    setState("loading");
    try {
      const [configRes, productsRes] = await Promise.all([
        api.get("/admin/config"),
        api.get("/products", { params: { sort: "discount" } }),
      ]);
      setBanner(configRes.data.banner || "");
      setDeals(productsRes.data.slice(0, 4));
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load the store. Check that the server is running, then try again."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="container showroom-page">
      {banner && (
        <div className="banner-band" role="note">
          <span className="banner-band__mark" aria-hidden="true"></span>
          {banner}
        </div>
      )}

      <section className="showroom-hero" aria-labelledby="home-title">
        <span className="showroom-hero__texture" aria-hidden="true"></span>
        <div className="showroom-hero__copy">
          <h1 id="home-title">Good finds,<br />all in one place.</h1>
          <p>Browse five aisles, compare clear INR prices and read customer reviews.</p>
          <Link className="showroom-hero__explore tap-target" to="/products">
            Browse all products
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>
        </div>
        <div className="showroom-hero__feature">
          <span className="showroom-hero__shape showroom-hero__shape--circle" aria-hidden="true"></span>
          <svg className="showroom-hero__shape showroom-hero__shape--star" aria-hidden="true" viewBox="0 0 64 64">
            <path d="M32 2 38 22 58 13 44 29 62 41 40 39 38 62 29 42 11 54 22 35 2 27 24 28Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          {state === "ready" && deals.length > 0 ? (
            <article className="showroom-hero__product">
              <ProductArtwork product={deals[0]} />
              <div className="showroom-hero__caption">
                <span>Featured find</span>
                <Link className="showroom-hero__title" to={"/products/" + deals[0]._id}>{deals[0].title}</Link>
                <span>{formatINR(discountedPrice(deals[0].price, deals[0].discount))} · {deals[0].discount}% off</span>
                <FeaturedAddToCart product={deals[0]} />
              </div>
            </article>
          ) : (
            <div className="showroom-hero__placeholder" aria-hidden="true">
              <span className="showroom-hero__placeholder-shape"></span>
              <span>New finds<br />coming into view</span>
            </div>
          )}
        </div>
      </section>

      <section className="category-index" aria-labelledby="category-title">
        <h2 id="category-title">Pick your aisle</h2>
        {CATEGORIES.map((cat) => (
            <Link className="category-index__link tap-target" key={cat} to={"/products?category=" + cat}>
              <span className="category-index__dot" aria-hidden="true"></span>
              {cat.replace("-", " ")}
            </Link>
        ))}
      </section>

      <section className="selection-section" aria-labelledby="selection-title">
        <div className="selection-section__heading">
          <div>
            <h2 id="selection-title">The current selection</h2>
            <p>Highest discounts first, just as listed in the catalog.</p>
          </div>
          <Link to="/products">
            See everything
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>
        </div>
        {state === "loading" && <LoadingBlock label="Loading products..." />}
        {state === "error" && <ErrorBlock message={error} onRetry={load} />}
        {state === "ready" && deals.length === 0 && (
          <EmptyBlock message="No products are in the catalog yet. Run the seed script on the server, then reload this page." />
        )}
        {state === "ready" && deals.length > 0 && (
          <div className="row g-3">
            {deals.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

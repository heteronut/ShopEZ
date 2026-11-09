import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { serverMessage } from "../api/axios";
import ProductCard from "../components/ProductCard";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StateBlock";

const CATEGORIES = ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const gender = searchParams.get("gender") || "";
  const sort = searchParams.get("sort") || "popular";

  async function load() {
    setState("loading");
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (gender) params.gender = gender;
      params.sort = sort;
      const { data } = await api.get("/products", { params });
      setProducts(data);
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load products. Check that the server is running, then try again."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, gender, sort]);

  function update(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <main className="container py-4">
      <h1 className="h2">Products</h1>
      <form className="row g-3 align-items-end mb-4" onSubmit={(e) => e.preventDefault()}>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="searchInput">Search products</label>
          <input
            id="searchInput"
            type="search"
            className="form-control"
            placeholder="Try headphones or rice"
            value={search}
            onChange={(e) => update("search", e.target.value)}
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label" htmlFor="categorySelect">Category</label>
          <select id="categorySelect" className="form-select" value={category} onChange={(e) => update("category", e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label" htmlFor="genderSelect">Gender</label>
          <select id="genderSelect" className="form-select" value={gender} onChange={(e) => update("gender", e.target.value)}>
            <option value="">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="sortSelect">Sort by</label>
          <select id="sortSelect" className="form-select" value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="popular">Popular (highest rated)</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="discount">Discount</option>
          </select>
        </div>
      </form>

      {state === "loading" && <LoadingBlock label="Loading products..." />}
      {state === "error" && <ErrorBlock message={error} onRetry={load} />}
      {state === "ready" && products.length === 0 && (
        <EmptyBlock message="No products match these filters. Clear the search or pick another category." />
      )}
      {state === "ready" && products.length > 0 && (
        <div className="row g-3">
          {products.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p._id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

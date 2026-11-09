import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { serverMessage } from "../../api/axios";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/StateBlock";
import { formatINR, discountedPrice } from "../../utils/format";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  async function load() {
    setState("loading");
    try {
      const { data } = await api.get("/products");
      setProducts(data);
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load products."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(product) {
    if (!window.confirm("Delete " + product.title + "? This cannot be undone.")) return;
    setError("");
    try {
      await api.delete("/products/" + product._id);
      setProducts((list) => list.filter((p) => p._id !== product._id));
    } catch (err) {
      setError(serverMessage(err, "Could not delete the product."));
    }
  }

  return (
    <main className="container admin-shell">
      <div className="admin-header">
        <div>
          <h1>Product library</h1>
          <p>Update catalog details, prices and available stock.</p>
        </div>
        <Link className="btn btn-primary tap-target" to="/admin/products/new">New Product</Link>
      </div>
      {error && state === "ready" && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
      {state === "loading" && <LoadingBlock label="Loading products..." />}
      {state === "error" && <ErrorBlock message={error} onRetry={load} />}
      {state === "ready" && products.length === 0 && (
        <EmptyBlock message="The catalog is empty. Add the first product with the New Product button." />
      )}
      {state === "ready" && products.length > 0 && (
        <div className="table-responsive mt-3">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">MRP</th>
                <th scope="col">Selling price</th>
                <th scope="col">Discount</th>
                <th scope="col">Stock</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td>{formatINR(discountedPrice(p.price, p.discount))}</td>
                  <td>{p.discount}%</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-secondary btn-sm tap-target" to={"/admin/products/" + p._id + "/edit"}>Edit</Link>
                      <button type="button" className="btn btn-outline-danger btn-sm tap-target" onClick={() => remove(p)}>Delete</button>
                    </div>
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

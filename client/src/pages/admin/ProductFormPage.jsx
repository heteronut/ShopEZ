import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { serverMessage } from "../../api/axios";
import { LoadingBlock } from "../../components/StateBlock";

const CATEGORIES = ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"];
const EMPTY = {
  title: "", description: "", price: "", discount: 0,
  category: "Mobiles", gender: "Unisex", sizes: "", stock: "",
};

// Used for both New Product (/admin/products/new) and Edit Product
// (/admin/products/:id/edit) so the two flows can never drift apart.
export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState(editing ? "loading" : "ready");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.get("/products/" + id)
      .then(({ data }) => {
        setForm({
          title: data.title, description: data.description, price: data.price,
          discount: data.discount, category: data.category, gender: data.gender,
          sizes: (data.sizes || []).join(", "), stock: data.stock,
        });
        setState("ready");
      })
      .catch((err) => {
        setError(serverMessage(err, "Could not load this product."));
        setState("ready");
      });
  }, [id, editing]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      discount: Number(form.discount),
      category: form.category,
      gender: form.gender,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
    };
    try {
      if (editing) await api.put("/products/" + id, payload);
      else await api.post("/products", payload);
      navigate("/admin/products");
    } catch (err) {
      setError(serverMessage(err, "Could not save the product."));
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") {
    return (
      <main className="container admin-shell">
        <LoadingBlock label="Loading product..." />
      </main>
    );
  }

  return (
    <main className="container admin-shell">
      <header className="admin-header">
        <div>
          <h1>{editing ? "Edit product" : "Add a product"}</h1>
          <p>Keep item details and stock information accurate for shoppers.</p>
        </div>
      </header>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={submit} className="col-12 col-md-8 px-0">
        <div className="mb-3">
          <label className="form-label" htmlFor="pfTitle">Title</label>
          <input id="pfTitle" className="form-control" required value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="pfDesc">Description</label>
          <textarea id="pfDesc" className="form-control" rows="3" required value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Sizes, materials, capacity, what is in the box. Facts a buyer needs, in plain words."></textarea>
        </div>
        <div className="row">
          <div className="col-6 col-md-3 mb-3">
            <label className="form-label" htmlFor="pfPrice">Price, MRP (INR)</label>
            <input id="pfPrice" type="number" min="0" className="form-control" required value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <label className="form-label" htmlFor="pfDiscount">Discount (percent)</label>
            <input id="pfDiscount" type="number" min="0" max="90" className="form-control" value={form.discount} onChange={(e) => set("discount", e.target.value)} />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <label className="form-label" htmlFor="pfStock">Stock</label>
            <input id="pfStock" type="number" min="0" className="form-control" required value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <label className="form-label" htmlFor="pfGender">Gender</label>
            <select id="pfGender" className="form-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option>Men</option>
              <option>Women</option>
              <option>Unisex</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label" htmlFor="pfCategory">Category</label>
            <select id="pfCategory" className="form-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label" htmlFor="pfSizes">Sizes, separated by commas (leave empty if the product has no sizes)</label>
            <input id="pfSizes" className="form-control" value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary tap-target" disabled={busy}>
          {busy ? "Saving..." : editing ? "Save changes" : "Add product"}
        </button>
      </form>
    </main>
  );
}

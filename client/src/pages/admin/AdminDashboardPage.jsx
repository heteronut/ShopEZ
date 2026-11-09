import { useEffect, useState } from "react";
import api, { serverMessage } from "../../api/axios";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/StateBlock";
import { formatINR } from "../../utils/format";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setState("loading");
    try {
      const [sumRes, cfgRes] = await Promise.all([api.get("/admin/summary"), api.get("/admin/config")]);
      setSummary(sumRes.data);
      setBanner(cfgRes.data.banner || "");
      setState("ready");
    } catch (err) {
      setError(serverMessage(err, "Could not load the dashboard."));
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveBanner(e) {
    e.preventDefault();
    setNotice("");
    try {
      await api.put("/admin/config", { banner });
      setNotice("Banner saved. It now appears on the home page.");
    } catch (err) {
      setError(serverMessage(err, "Could not save the banner."));
    }
  }

  if (state === "loading") {
    return (
      <main className="container admin-shell">
        <LoadingBlock label="Loading dashboard..." />
      </main>
    );
  }
  if (state === "error" && !summary) {
    return (
      <main className="container admin-shell">
        <ErrorBlock message={error} onRetry={load} />
      </main>
    );
  }

  return (
    <main className="container admin-shell">
      <header className="admin-header">
        <div>
          <h1>Store overview</h1>
          <p>Figures come from the current catalog and orders. Cancelled orders are excluded from revenue.</p>
        </div>
      </header>
      <div className="row g-3 mb-4">
        {[
          ["Revenue (placed orders)", formatINR(summary.revenue)],
          ["Total orders", summary.totalOrders],
          ["Items sold", summary.itemsSold],
          ["Registered users", summary.totalUsers],
          ["Products in catalog", summary.totalProducts],
        ].map(([label, value]) => (
          <div className="col-6 col-md-4 col-lg" key={label}>
            <div className="admin-stat h-100">
              <p className="mb-2">{label}</p>
              <p>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="admin-section">
      <h2>Sales by category</h2>
      {summary.salesByCategory.length === 0 ? (
        <EmptyBlock message="No sales yet. This table fills in as orders are placed." />
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-striped align-middle">
            <thead>
              <tr><th scope="col">Category</th><th scope="col">Items ordered</th><th scope="col">Gross value (before discount)</th></tr>
            </thead>
            <tbody>
              {summary.salesByCategory.map((row) => (
                <tr key={row._id}>
                  <td>{row._id}</td>
                  <td>{row.orders}</td>
                  <td>{formatINR(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </section>

      <section className="admin-section">
      <h2>Low stock (5 or fewer left)</h2>
      {summary.lowStock.length === 0 ? (
        <EmptyBlock message="No product is at 5 units or fewer." />
      ) : (
        <ul className="list-group mb-4">
          {summary.lowStock.map((p) => (
            <li className="list-group-item d-flex justify-content-between" key={p._id}>
              <span>{p.title} ({p.category})</span>
              <strong>{p.stock} left</strong>
            </li>
          ))}
        </ul>
      )}

      </section>

      <section className="admin-section">
      <h2>Home page banner</h2>
      {notice && <div className="alert alert-success col-12 col-md-8" role="status">{notice}</div>}
      <form onSubmit={saveBanner} className="col-12 col-md-8 px-0">
        <div className="mb-3">
          <label className="form-label" htmlFor="bannerInput">Banner text shown on the home page (leave empty to hide it)</label>
          <input id="bannerInput" className="form-control" value={banner} onChange={(e) => setBanner(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary tap-target">Save banner</button>
      </form>
      </section>
    </main>
  );
}

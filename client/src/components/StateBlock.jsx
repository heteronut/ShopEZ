export function LoadingBlock({ label }) {
  return (
    <div className="py-5 text-center" role="status">
      <div className="spinner-border" aria-hidden="true"></div>
      <p className="mt-2 mb-0">{label || "Loading..."}</p>
    </div>
  );
}

export function ErrorBlock({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-outline-danger btn-sm tap-target" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({ message }) {
  return (
    <div className="empty-block" role="status">
      {message}
    </div>
  );
}

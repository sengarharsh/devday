import { useState, useEffect } from "react";
import {
  getAllBrainDumps,
  createBrainDump,
  deleteBrainDump,
} from "../../api/api";

const BrainDump = () => {
  const [dumps, setDumps] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchBrainDumps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBrainDumps();
      // Ensure newest entries first
      const sorted = [...data].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setDumps(sorted);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load brain dumps from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrainDumps();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const savedDump = await createBrainDump({ content: content.trim() });
      setDumps((prev) => [savedDump, ...prev]);
      setContent("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save brain dump."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setProcessingId(id);
      setError(null);
      await deleteBrainDump(id);
      setDumps((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete brain dump."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Brain Dump</h2>
        <p className="text-muted mb-0">
          Quickly capture thoughts, ideas, and things to remember. Organize them later.
        </p>
      </div>

      {/* Global Error Alert with Retry */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center mb-4"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchBrainDumps}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {/* New Brain Dump */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">New Brain Dump</h5>
          <form onSubmit={handleSave}>
            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Write anything on your mind..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
            />
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !content.trim()}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Saved Brain Dumps */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title fw-bold mb-0">Saved Brain Dumps</h5>
            <span className="badge bg-secondary">{dumps.length}</span>
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Loading brain dumps...
            </div>
          ) : dumps.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              Nothing here yet. Dump whatever is on your mind!
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {dumps.map((dump) => {
                const isDeleting = processingId === dump.id;
                return (
                  <div key={dump.id} className="p-3 rounded bg-light border">
                    <p className="mb-2" style={{ whiteSpace: "pre-line" }}>
                      {dump.content}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {formatDate(dump.createdAt)}
                      </small>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(dump.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrainDump;

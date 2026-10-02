import { useState } from "react";

const BrainDump = () => {
  const [dumps, setDumps] = useState([]);
  const [content, setContent] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newDump = {
      id: Date.now().toString(),
      content: content.trim(),
      createdAt: new Date()
    };

    setDumps((prev) => [newDump, ...prev]);
    setContent("");
  };

  const handleDelete = (id) => {
    setDumps((prev) => prev.filter((d) => d.id !== id));
  };

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
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
            />
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                Save
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

          {dumps.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              Nothing here yet. Dump whatever is on your mind!
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {dumps.map((dump) => (
                <div key={dump.id} className="p-3 rounded bg-light border">
                  <p className="mb-2" style={{ whiteSpace: "pre-line" }}>
                    {dump.content}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{formatDate(dump.createdAt)}</small>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(dump.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrainDump;

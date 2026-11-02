import { useState } from "react";

const ACTIVITY_TYPES = ["DSA", "React", "Java", "Project", "Other"];

const parseMinutes = (input) => {
  if (!input && input !== 0) return NaN;
  if (typeof input === "number") return input > 0 ? Math.round(input) : NaN;
  const num = parseInt(String(input).trim().replace(/[^\d]/g, ""), 10);
  return isNaN(num) || num <= 0 ? NaN : num;
};

const ActivityForm = ({ isOpen, onClose, onAddActivity, submitting }) => {
  const [type, setType] = useState("DSA");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setValidationError("");
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Activity title is required.");
      return;
    }

    if (!String(duration).trim()) {
      setValidationError("Duration in minutes is required (e.g. 45).");
      return;
    }

    const minutes = parseMinutes(duration);
    if (isNaN(minutes) || minutes <= 0) {
      setValidationError("Please enter a valid duration in minutes (e.g. 45).");
      return;
    }

    try {
      await onAddActivity({
        type,
        title: title.trim(),
        topic: topic.trim() || null,
        duration: minutes,
        notes: notes.trim() || null,
      });

      // Clear form and close only after successful API response
      setTitle("");
      setTopic("");
      setDuration("");
      setNotes("");
      setValidationError("");
      if (onClose) onClose();
    } catch {
      // Error handled by parent; modal remains open for retry
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow border-0">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">Add Activity</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
              disabled={submitting}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {validationError && (
                <div className="alert alert-warning py-2 small mb-3" role="alert">
                  {validationError}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold small">Activity Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={submitting}
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Solved Two Sum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                  autoFocus
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Topic</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Arrays"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Duration (minutes) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="e.g. 45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold small">Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Used HashMap approach"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Activity"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;

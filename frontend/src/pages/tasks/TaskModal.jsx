import { useState } from "react";

const TaskModal = ({ isOpen, onClose, onTaskCreated, categories = [] }) => {
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState(categories[0] || "React");
  const [dailyTask, setDailyTask] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await onTaskCreated({
        title: title.trim(),
        skill,
        dailyTask,
        completed: false,
      });
      // Reset & close only after success
      setTitle("");
      setSkill(categories[0] || "React");
      setDailyTask(false);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow border-0">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Add New Task</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                disabled={submitting}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body py-3">
                {error && (
                  <div className="alert alert-danger py-2 small mb-3" role="alert">
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="taskTitle" className="form-label fw-semibold small">
                    Task Title <span className="text-danger">*</span>
                  </label>
                  <input
                    id="taskTitle"
                    type="text"
                    className="form-control"
                    placeholder="e.g., Practice Binary Search Tree..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={submitting}
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="taskSkill" className="form-label fw-semibold small">
                    Category / Skill
                  </label>
                  <select
                    id="taskSkill"
                    className="form-select"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    disabled={submitting}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="modalDailyTask"
                    checked={dailyTask}
                    onChange={(e) => setDailyTask(e.target.checked)}
                    disabled={submitting}
                  />
                  <label className="form-check-label text-muted small" htmlFor="modalDailyTask">
                    Daily Task <span className="text-secondary">(resets daily)</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !title.trim()}
                >
                  {submitting ? "Saving..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;

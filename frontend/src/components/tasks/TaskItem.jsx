const formatDateTime = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const TaskItem = ({ task, onToggle, onDelete, isProcessing }) => {
  const isDaily = task.dailyTask || task.isDaily;
  const skillLabel = task.skill || task.category || "General";

  return (
    <div
      className={`d-flex justify-content-between align-items-center p-3 rounded border ${
        task.completed ? "bg-light opacity-75" : "bg-white"
      }`}
    >
      <div className="d-flex align-items-center gap-3">
        <input
          type="checkbox"
          className="form-check-input mt-0"
          checked={task.completed}
          onChange={() => onToggle(task)}
          disabled={isProcessing}
          id={`task-${task.id}`}
        />
        <div>
          <label
            htmlFor={`task-${task.id}`}
            className={`form-check-label mb-0 ${
              task.completed ? "text-muted" : "fw-medium"
            }`}
            role="button"
          >
            {task.title}
          </label>
          {task.completed && task.completedAt && (
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
              Completed at {formatDateTime(task.completedAt)}
            </div>
          )}
        </div>
        <span className="badge bg-secondary-subtle text-secondary-emphasis">
          {skillLabel}
        </span>
        {isDaily && (
          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
            Daily
          </span>
        )}
      </div>

      <div className="d-flex align-items-center gap-2">
        <span
          className={`badge d-inline-flex align-items-center justify-content-center px-3 py-2 ${
            task.completed ? "bg-success" : "bg-warning text-dark"
          }`}
          style={{ minHeight: "31px" }}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(task.id)}
          disabled={isProcessing}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

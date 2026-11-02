const formatTime = (date) => {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatMinutes = (minutes) => {
  if (!minutes && minutes !== 0) return "—";
  return `${minutes} mins`;
};

const ActivityTable = ({ items = [], onDelete, processingId }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Title</th>
            <th>Topic</th>
            <th>Duration</th>
            <th>Notes</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const isDeleting = processingId === a.id;
            const durationVal = a.duration ?? a.durationMinutes;
            return (
              <tr key={a.id}>
                <td className="text-muted small">
                  {formatTime(a.createdAt || a.timestamp)}
                </td>
                <td>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">
                    {a.type}
                  </span>
                </td>
                <td className="fw-medium">{a.title}</td>
                <td className="text-muted small">{a.topic || "—"}</td>
                <td>
                  <span className="badge bg-primary-subtle text-primary-emphasis">
                    {formatMinutes(durationVal)}
                  </span>
                </td>
                <td className="text-muted small">{a.notes || "—"}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDelete(a.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;

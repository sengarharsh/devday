import { useState } from "react";

const ACTIVITY_TYPES = ["DSA", "React", "Java", "Project", "Other"];

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const parseDuration = (input) => {
  const trimmed = input.trim().toLowerCase();
  // "90 min", "90min", "90"
  const match = trimmed.match(/^(\d+)\s*(min|m)?$/);
  if (match) return parseInt(match[1], 10);
  // "1h 30m", "1h30m"
  const hmMatch = trimmed.match(/^(\d+)\s*h\s*(\d+)?\s*(m|min)?$/);
  if (hmMatch) {
    const hours = parseInt(hmMatch[1], 10);
    const mins = hmMatch[2] ? parseInt(hmMatch[2], 10) : 0;
    return hours * 60 + mins;
  }
  return NaN;
};

const Activity = () => {
  const [activities, setActivities] = useState([]);

  // Form state
  const [type, setType] = useState("DSA");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!title.trim() || !duration.trim()) return;

    const minutes = parseDuration(duration);
    if (isNaN(minutes) || minutes <= 0) return;

    const newActivity = {
      id: Date.now().toString(),
      type,
      title: title.trim(),
      topic: topic.trim(),
      durationMinutes: minutes,
      notes: notes.trim(),
      timestamp: new Date()
    };

    setActivities((prev) => [newActivity, ...prev]);
    setTitle("");
    setTopic("");
    setDuration("");
    setNotes("");
  };

  // Today's summary by type
  const summaryByType = {};
  let totalMinutes = 0;
  activities.forEach((a) => {
    summaryByType[a.type] = (summaryByType[a.type] || 0) + a.durationMinutes;
    totalMinutes += a.durationMinutes;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Activity</h2>
        <p className="text-muted mb-0">Track your daily learning and development activities.</p>
      </div>

      {/* Add Activity Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Add Activity</h5>
          <form onSubmit={handleAddActivity}>
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label fw-medium">Activity Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-5">
                <label className="form-label fw-medium">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Solved Two Sum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Topic</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Arrays"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-medium">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 45 min"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-7">
                <label className="form-label fw-medium">Notes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Used HashMap approach"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  Add Activity
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Today's Activity List */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Today's Activity</h5>
          {activities.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              No activities logged yet. Add one above to get started!
            </p>
          ) : (
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a.id}>
                      <td className="text-muted small">{formatTime(a.timestamp)}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary-emphasis">
                          {a.type}
                        </span>
                      </td>
                      <td className="fw-medium">{a.title}</td>
                      <td className="text-muted small">{a.topic || "—"}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary-emphasis">
                          {formatDuration(a.durationMinutes)}
                        </span>
                      </td>
                      <td className="text-muted small">{a.notes || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            setActivities((prev) => prev.filter((x) => x.id !== a.id))
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Today's Summary */}
      {activities.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Today's Summary</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center p-3 rounded bg-primary-subtle border">
                <span className="fw-bold">Total Learning Time</span>
                <span className="fw-bold fs-5">{formatDuration(totalMinutes)}</span>
              </div>
              {Object.entries(summaryByType)
                .sort((a, b) => b[1] - a[1])
                .map(([typeName, mins]) => (
                  <div
                    key={typeName}
                    className="d-flex justify-content-between align-items-center p-3 rounded bg-light border"
                  >
                    <span className="fw-medium">{typeName}</span>
                    <span className="text-secondary">{formatDuration(mins)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;

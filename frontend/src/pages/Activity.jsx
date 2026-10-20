import { useState } from "react";

const ACTIVITY_TYPES = ["DSA", "React", "Java", "Project", "Other"];

const formatTime = (date) => {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "—";
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

const initialTodayActivities = [
  {
    id: "today-1",
    type: "DSA",
    title: "Solved Two Sum and Valid Anagram",
    topic: "Arrays & Hashing",
    durationMinutes: 60,
    notes: "Used hash map for O(n) lookup",
    timestamp: new Date()
  },
  {
    id: "today-2",
    type: "React",
    title: "Built DevDay Activity component",
    topic: "Component State",
    durationMinutes: 90,
    notes: "Implemented views and duration parser",
    timestamp: new Date(Date.now() - 3600000 * 2)
  }
];

const initialPastActivities = [
  {
    id: "past-1",
    type: "Java",
    title: "Spring Boot JPA Entity Setup",
    topic: "JPA / Hibernate",
    durationMinutes: 45,
    notes: "Configured entity models and repositories",
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: "past-2",
    type: "Project",
    title: "Database schema migration",
    topic: "Supabase PostgreSQL",
    durationMinutes: 75,
    notes: "Created tasks and activities tables",
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: "past-3",
    type: "DSA",
    title: "Reverse Linked List",
    topic: "Linked Lists",
    durationMinutes: 40,
    notes: "Iterative pointer reversal technique",
    timestamp: new Date(Date.now() - 86400000 * 2) // 2 days ago
  }
];

const Activity = () => {
  const [activities, setActivities] = useState(initialTodayActivities);
  const [pastActivities, setPastActivities] = useState(initialPastActivities);
  const [viewMode, setViewMode] = useState("today"); // "today" | "past"

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
    setViewMode("today");
  };

  const handleDeleteActivity = (id) => {
    if (viewMode === "today") {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } else {
      setPastActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Group past activities by date (newest first)
  const groupActivitiesByDate = (list) => {
    const map = new Map();
    list.forEach((act) => {
      const d = act.timestamp instanceof Date ? act.timestamp : new Date(act.timestamp);
      const dateKey = d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey).push(act);
    });
    return Array.from(map.entries());
  };

  // Summary by type for today's activities
  const summaryByType = {};
  let totalMinutes = 0;
  activities.forEach((a) => {
    const mins = a.durationMinutes || 0;
    summaryByType[a.type] = (summaryByType[a.type] || 0) + mins;
    totalMinutes += mins;
  });

  const renderTable = (items) => (
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
          {items.map((a) => (
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
                  onClick={() => handleDeleteActivity(a.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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

      {/* Activity List Container */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title fw-bold mb-0">
              {viewMode === "today" ? "Today's Activity" : "Past Activities"}
            </h5>
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${viewMode === "today" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("today")}
              >
                Today's Activity
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === "past" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("past")}
              >
                Past Activity
              </button>
            </div>
          </div>

          {viewMode === "today" ? (
            activities.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">
                No activities logged yet for today. Add one above to get started!
              </p>
            ) : (
              renderTable(activities)
            )
          ) : pastActivities.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              No past activities logged.
            </p>
          ) : (
            <div className="d-flex flex-column gap-4">
              {groupActivitiesByDate(pastActivities).map(([dateLabel, items]) => (
                <div key={dateLabel}>
                  <h6 className="fw-bold text-secondary border-bottom pb-2 mb-2">
                    {dateLabel}
                  </h6>
                  {renderTable(items)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Summary (shown only in Today's view when activities exist) */}
      {viewMode === "today" && activities.length > 0 && (
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

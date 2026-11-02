import { useState, useEffect, useMemo } from "react";
import {
  getAllActivities,
  createActivity,
  deleteActivity,
} from "../../api/api";
import ActivityForm from "./ActivityForm";
import ActivityTable from "./ActivityTable";
import ActivitySummary from "./ActivitySummary";

const isToday = (dateString) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [viewMode, setViewMode] = useState("today"); // "today" | "past"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllActivities();
      setActivities(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load activities from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async (payload) => {
    try {
      setSubmitting(true);
      setError(null);
      const savedActivity = await createActivity(payload);
      setActivities((prev) => [savedActivity, ...prev]);
      setViewMode("today");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
          err.message ||
          "Failed to save activity.";
      setError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      setProcessingId(id);
      setError(null);
      await deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete activity."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Filter and sort today's activities (newest first)
  const todayActivities = useMemo(() => {
    return activities
      .filter((a) => isToday(a.createdAt))
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [activities]);

  // Filter past activities and group by date (newest date first, newest within date first)
  const groupedPastActivities = useMemo(() => {
    const past = activities.filter((a) => !isToday(a.createdAt));
    const sorted = [...past].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    const map = new Map();
    sorted.forEach((act) => {
      const d = act.createdAt ? new Date(act.createdAt) : null;
      const dateKey =
        d && !isNaN(d.getTime())
          ? d.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Prior Activities";

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey).push(act);
    });

    return Array.from(map.entries());
  }, [activities]);

  const pastCount = useMemo(() => {
    return activities.filter((a) => !isToday(a.createdAt)).length;
  }, [activities]);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Activity</h2>
          <p className="text-muted mb-0">
            Track your daily learning and development activities.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="fw-bold fs-6">+</span> Add Activity
        </button>
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
            onClick={fetchActivities}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {/* Activity Summary Dashboard (4 Compact Cards) */}
      <ActivitySummary activities={todayActivities} />

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
                className={`btn btn-sm ${
                  viewMode === "today" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => setViewMode("today")}
              >
                Today's Activity ({todayActivities.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === "past" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => setViewMode("past")}
              >
                Past Activity ({pastCount})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Loading activities...
            </div>
          ) : viewMode === "today" ? (
            todayActivities.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">
                No activities logged yet for today. Click &quot;+ Add Activity&quot; above to get started!
              </p>
            ) : (
              <ActivityTable
                items={todayActivities}
                onDelete={handleDeleteActivity}
                processingId={processingId}
              />
            )
          ) : groupedPastActivities.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              No past activities logged.
            </p>
          ) : (
            <div className="d-flex flex-column gap-4">
              {groupedPastActivities.map(([dateLabel, items]) => (
                <div key={dateLabel}>
                  <h6 className="fw-bold text-secondary border-bottom pb-2 mb-2">
                    📅 {dateLabel}
                  </h6>
                  <ActivityTable
                    items={items}
                    onDelete={handleDeleteActivity}
                    processingId={processingId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      <ActivityForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddActivity={handleAddActivity}
        submitting={submitting}
      />
    </div>
  );
};

export default Activity;

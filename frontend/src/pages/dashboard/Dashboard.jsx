import { useState, useEffect, useMemo } from "react";
import {
  getAllTasks,
  getAllDSAQuestions,
  getAllActivities,
} from "../../api/api";

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

const formatHoursAndMinutes = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0) return "0 mins";
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${mins} min${mins > 1 ? "s" : ""}`;
};

const categoryBadgeClass = (category) => {
  const map = {
    DSA: "bg-success",
    React: "bg-primary",
    Java: "bg-warning text-dark",
    Project: "bg-info text-dark",
    Other: "bg-secondary",
  };
  return map[category] || "bg-secondary";
};

const calculateStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  const activeDates = new Set();
  activities.forEach((act) => {
    if (act.createdAt) {
      const d = new Date(act.createdAt);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        activeDates.add(`${year}-${month}-${day}`);
      }
    }
  });

  if (activeDates.size === 0) return 0;

  const formatDateKey = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const todayKey = formatDateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  let currentCheckDate = new Date(now);
  let streak = 0;

  if (activeDates.has(todayKey)) {
    while (activeDates.has(formatDateKey(currentCheckDate))) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    }
  } else if (activeDates.has(yesterdayKey)) {
    currentCheckDate = new Date(yesterday);
    while (activeDates.has(formatDateKey(currentCheckDate))) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    }
  }

  return streak;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [dsaQuestions, setDsaQuestions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, dsaData, activitiesData] = await Promise.all([
        getAllTasks(),
        getAllDSAQuestions(),
        getAllActivities(),
      ]);
      setTasks(tasksData || []);
      setDsaQuestions(dsaData || []);
      setActivities(activitiesData || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Summary Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const totalDSA = dsaQuestions.length;
  const solvedDSA = dsaQuestions.filter((q) => q.completed).length;
  const bookmarkedDSA = dsaQuestions.filter((q) => q.bookmarked).length;
  const dsaCompletionPct =
    totalDSA > 0 ? Math.round((solvedDSA / totalDSA) * 100) : 0;

  // Filter today's activities & learning time
  const todayActivities = useMemo(() => {
    return activities
      .filter((a) => isToday(a.createdAt))
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [activities]);

  const totalLearningMinutes = useMemo(() => {
    return todayActivities.reduce((acc, a) => acc + (a.duration || 0), 0);
  }, [todayActivities]);

  const streak = useMemo(() => {
    return calculateStreak(activities);
  }, [activities]);

  // Filter today's tasks
  const todayTasks = useMemo(() => {
    return tasks
      .filter(
        (t) =>
          isToday(t.createdAt) ||
          t.dailyTask ||
          (t.completed && isToday(t.completedAt))
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [tasks]);

  // Solved today count for DSA
  const solvedTodayDSA = useMemo(() => {
    return dsaQuestions.filter(
      (q) =>
        q.completed &&
        ((q.completedAt && isToday(q.completedAt)) ||
          (q.createdAt && isToday(q.createdAt)))
    ).length;
  }, [dsaQuestions]);

  // DSA difficulty breakdown
  const dsaDifficulty = useMemo(() => {
    return {
      easy: {
        solved: dsaQuestions.filter(
          (q) => q.difficulty?.toLowerCase() === "easy" && q.completed
        ).length,
        total: dsaQuestions.filter(
          (q) => q.difficulty?.toLowerCase() === "easy"
        ).length,
      },
      medium: {
        solved: dsaQuestions.filter(
          (q) => q.difficulty?.toLowerCase() === "medium" && q.completed
        ).length,
        total: dsaQuestions.filter(
          (q) => q.difficulty?.toLowerCase() === "medium"
        ).length,
      },
      hard: {
        solved: dsaQuestions.filter(
          (q) => q.difficulty?.toLowerCase() === "hard" && q.completed
        ).length,
        total: dsaQuestions.filter(
          (q) => q.difficulty?.toLowerCase() === "hard"
        ).length,
      },
    };
  }, [dsaQuestions]);

  // Category breakdown for learning time
  const categorySummary = useMemo(() => {
    const counts = {};
    const source = todayActivities.length > 0 ? todayActivities : activities;
    source.forEach((a) => {
      const cat = a.type || "Other";
      counts[cat] = (counts[cat] || 0) + (a.duration || 0);
    });
    const total = Object.values(counts).reduce((sum, m) => sum + m, 0);
    return Object.entries(counts)
      .map(([category, minutes]) => ({
        category,
        minutes,
        pct: total > 0 ? Math.round((minutes / total) * 100) : 0,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [todayActivities, activities]);

  return (
    <div>
      {/* 1. Welcome Section */}
      <div className="mb-3">
        <h3 className="fw-bold mb-1" style={{ fontSize: "1.5rem" }}>
          Welcome back 👋
        </h3>
        <p className="text-muted small mb-0">
          Here&apos;s your development overview for today.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center mb-3"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Today's Summary Cards */}
      <div className="row g-2 g-md-3 mb-3">
        {/* Tasks Card */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">
              <span
                className="card-subtitle text-secondary d-block text-uppercase fw-semibold mb-2"
                style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
              >
                Tasks
              </span>
              <div className="fs-3 fw-bold text-primary lh-1">
                {completedTasks}/{totalTasks}
              </div>
              <small className="text-muted d-block mt-2" style={{ fontSize: "0.75rem" }}>
                {pendingTasks} Pending
              </small>
            </div>
          </div>
        </div>

        {/* DSA Problems Card */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">
              <span
                className="card-subtitle text-secondary d-block text-uppercase fw-semibold mb-2"
                style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
              >
                DSA Problems
              </span>
              <div className="fs-3 fw-bold text-success lh-1">
                {solvedDSA}/{totalDSA}
              </div>
              <small className="text-muted d-block mt-2" style={{ fontSize: "0.75rem" }}>
                {solvedTodayDSA} Solved Today
              </small>
            </div>
          </div>
        </div>

        {/* Learning Time Card */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">
              <span
                className="card-subtitle text-secondary d-block text-uppercase fw-semibold mb-2"
                style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
              >
                Learning Time
              </span>
              <div className="fs-3 fw-bold text-info lh-1">
                {formatHoursAndMinutes(totalLearningMinutes)}
              </div>
              <small className="text-muted d-block mt-2" style={{ fontSize: "0.75rem" }}>
                {todayActivities.length} {todayActivities.length === 1 ? "Activity" : "Activities"} Today
              </small>
            </div>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">
              <span
                className="card-subtitle text-secondary d-block text-uppercase fw-semibold mb-2"
                style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
              >
                Current Streak
              </span>
              <div className="fs-3 fw-bold text-warning lh-1">
                {streak} {streak === 1 ? "Day" : "Days"} 🔥
              </div>
              <small className="text-muted d-block mt-2" style={{ fontSize: "0.75rem" }}>
                {streak > 0 ? "Active streak" : "Start logging today"}
              </small>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          />
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* 3. Middle Row: Today's Tasks (Left) & Today's Activity (Right) */}
          <div className="row g-3 mb-3">
            {/* Today's Tasks */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3 p-md-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                      Today&apos;s Tasks
                    </h6>
                    <span
                      className="badge bg-primary-subtle text-primary-emphasis py-1 px-2"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {todayTasks.length} {todayTasks.length === 1 ? "Task" : "Tasks"}
                    </span>
                  </div>

                  {todayTasks.length === 0 ? (
                    <div className="text-muted text-center py-4 small flex-grow-1 d-flex align-items-center justify-content-center">
                      No tasks scheduled for today.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-start">
                      {todayTasks.slice(0, 4).map((task) => (
                        <div
                          key={task.id}
                          className="d-flex justify-content-between align-items-center p-2 px-3 rounded bg-light border"
                          style={{ fontSize: "0.875rem" }}
                        >
                          <div className="d-flex align-items-center gap-2 flex-wrap text-truncate me-2">
                            <span className="fw-semibold text-truncate">{task.title}</span>
                            {(task.skill || task.category) && (
                              <span
                                className="badge bg-secondary-subtle text-secondary py-1 px-2"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {task.skill || task.category}
                              </span>
                            )}
                            {task.dailyTask && (
                              <span
                                className="badge bg-info-subtle text-info-emphasis border border-info-subtle py-1 px-2"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Daily
                              </span>
                            )}
                          </div>
                          <span
                            className={`badge ${
                              task.completed ? "bg-success" : "bg-warning text-dark"
                            } py-1 px-2 flex-shrink-0`}
                            style={{ fontSize: "0.725rem" }}
                          >
                            {task.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                      ))}
                      {todayTasks.length > 4 && (
                        <small className="text-muted text-center mt-1">
                          +{todayTasks.length - 4} more tasks
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Today's Activity */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3 p-md-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                      Today&apos;s Activity
                    </h6>
                    <span
                      className="badge bg-success-subtle text-success-emphasis py-1 px-2"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {todayActivities.length} {todayActivities.length === 1 ? "Logged" : "Logged"}
                    </span>
                  </div>

                  {todayActivities.length === 0 ? (
                    <div className="text-muted text-center py-4 small flex-grow-1 d-flex align-items-center justify-content-center">
                      No activities logged today yet.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-start">
                      {todayActivities.slice(0, 4).map((activity) => (
                        <div
                          key={activity.id}
                          className="d-flex justify-content-between align-items-center p-2 px-3 rounded bg-light border"
                          style={{ fontSize: "0.875rem" }}
                        >
                          <div className="d-flex align-items-center gap-2 flex-wrap text-truncate me-2">
                            <span
                              className={`badge ${categoryBadgeClass(activity.type)} py-1 px-2`}
                              style={{ fontSize: "0.7rem" }}
                            >
                              {activity.type}
                            </span>
                            <span className="fw-semibold text-truncate">{activity.title}</span>
                            {activity.topic && (
                              <span
                                className="text-muted small"
                                style={{ fontSize: "0.75rem" }}
                              >
                                ({activity.topic})
                              </span>
                            )}
                          </div>
                          <span
                            className="text-secondary fw-medium flex-shrink-0"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {formatHoursAndMinutes(
                              activity.duration ?? activity.durationMinutes
                            )}
                          </span>
                        </div>
                      ))}
                      {todayActivities.length > 4 && (
                        <small className="text-muted text-center mt-1">
                          +{todayActivities.length - 4} more activities
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bottom Row: Activity Breakdown & DSA Overview */}
          <div className="row g-3">
            {/* Activity Breakdown */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3 p-md-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                      Activity Breakdown
                    </h6>
                    <span className="text-muted small" style={{ fontSize: "0.775rem" }}>
                      {todayActivities.length > 0 ? "Today's Focus" : "Overall Focus"}
                    </span>
                  </div>

                  {categorySummary.length === 0 ? (
                    <div className="text-muted text-center py-4 small flex-grow-1 d-flex align-items-center justify-content-center">
                      Log activities to view category breakdown.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-around">
                      {categorySummary.slice(0, 4).map((c) => (
                        <div key={c.category} className="p-2 px-3 rounded bg-light border">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span
                              className={`badge ${categoryBadgeClass(c.category)} py-1 px-2`}
                              style={{ fontSize: "0.72rem" }}
                            >
                              {c.category}
                            </span>
                            <span
                              className="text-muted fw-medium"
                              style={{ fontSize: "0.775rem" }}
                            >
                              {formatHoursAndMinutes(c.minutes)}{" "}
                              <span className="text-secondary">({c.pct}%)</span>
                            </span>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: `${c.pct}%` }}
                              aria-valuenow={c.pct}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DSA Overview */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3 p-md-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                      DSA Overview
                    </h6>
                    <span
                      className="badge bg-success-subtle text-success-emphasis py-1 px-2"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {dsaCompletionPct}% Solved
                    </span>
                  </div>

                  {totalDSA === 0 ? (
                    <div className="text-muted text-center py-4 small flex-grow-1 d-flex align-items-center justify-content-center">
                      Add questions in the DSA tab to view progress.
                    </div>
                  ) : (
                    <div className="d-flex flex-column justify-content-between flex-grow-1 gap-3">
                      <div>
                        <div
                          className="d-flex justify-content-between text-muted mb-1"
                          style={{ fontSize: "0.775rem" }}
                        >
                          <span>Overall Progress</span>
                          <span className="fw-medium">
                            {solvedDSA} / {totalDSA} Questions
                          </span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${dsaCompletionPct}%` }}
                            aria-valuenow={dsaCompletionPct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>

                      {/* Difficulty Breakdown Boxes */}
                      <div className="row g-2 text-center">
                        <div className="col-4">
                          <div className="p-2 rounded bg-light border">
                            <span
                              className="badge bg-success py-1 px-2 mb-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Easy
                            </span>
                            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                              {dsaDifficulty.easy.solved}/{dsaDifficulty.easy.total}
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="p-2 rounded bg-light border">
                            <span
                              className="badge bg-warning text-dark py-1 px-2 mb-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Medium
                            </span>
                            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                              {dsaDifficulty.medium.solved}/{dsaDifficulty.medium.total}
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="p-2 rounded bg-light border">
                            <span
                              className="badge bg-danger py-1 px-2 mb-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Hard
                            </span>
                            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                              {dsaDifficulty.hard.solved}/{dsaDifficulty.hard.total}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Secondary info row */}
                      <div
                        className="d-flex justify-content-between text-muted pt-2 border-top"
                        style={{ fontSize: "0.775rem" }}
                      >
                        <span>⭐ {bookmarkedDSA} Bookmarked</span>
                        <span className="text-success fw-medium">
                          ✓ {solvedTodayDSA} Solved Today
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

import { useMemo } from "react";

const difficultyBadge = (difficulty) => {
  const colors = {
    easy: "bg-success",
    medium: "bg-warning text-dark",
    hard: "bg-danger",
  };
  return colors[difficulty?.toLowerCase()] || "bg-secondary";
};

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

const isSolvedToday = (q) => {
  if (!q || !q.completed) return false;
  if (q.completedAt && isToday(q.completedAt)) return true;
  if (q.solvedAt && isToday(q.solvedAt)) return true;
  if (q.updatedAt && isToday(q.updatedAt)) return true;
  if (q.createdAt && isToday(q.createdAt)) return true;
  return false;
};

const DSADashboard = ({ questions = [], onSelectQuestionForCoach }) => {
  const total = questions.length;
  const completed = questions.filter((q) => q.completed).length;
  const bookmarked = questions.filter((q) => q.bookmarked).length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Questions solved today
  const solvedToday = useMemo(() => {
    return questions.filter((q) => isSolvedToday(q));
  }, [questions]);

  // Up to 3 unsolved questions from actual data
  const unsolvedQuestions = useMemo(() => {
    return questions.filter((q) => !q.completed).slice(0, 3);
  }, [questions]);

  // Difficulty counts (solved vs total)
  const difficulties = useMemo(() => {
    return [
      {
        label: "Easy",
        color: "success",
        total: questions.filter((q) => q.difficulty?.toLowerCase() === "easy").length,
        solved: questions.filter(
          (q) => q.difficulty?.toLowerCase() === "easy" && q.completed
        ).length,
      },
      {
        label: "Medium",
        color: "warning",
        total: questions.filter((q) => q.difficulty?.toLowerCase() === "medium").length,
        solved: questions.filter(
          (q) => q.difficulty?.toLowerCase() === "medium" && q.completed
        ).length,
      },
      {
        label: "Hard",
        color: "danger",
        total: questions.filter((q) => q.difficulty?.toLowerCase() === "hard").length,
        solved: questions.filter(
          (q) => q.difficulty?.toLowerCase() === "hard" && q.completed
        ).length,
      },
    ];
  }, [questions]);

  // Top 5 topics by number of solved questions
  const topTopics = useMemo(() => {
    const topicCounts = {};
    questions.forEach((q) => {
      if (q.topic && q.completed) {
        topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
      }
    });
    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [questions]);

  // 5 Summary Stat Cards
  const statCards = [
    { label: "Total Questions", value: total, color: "primary" },
    { label: "Solved", value: completed, color: "success" },
    { label: "Solved Today", value: solvedToday.length, color: "success" },
    { label: "Bookmarked", value: bookmarked, color: "warning" },
    { label: "Completion %", value: `${completionPct}%`, color: "info" },
  ];

  return (
    <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
      {/* 1. Summary Cards (5 Cards) */}
      <div className="row g-2 g-md-3 mb-3">
        {statCards.map((card) => (
          <div key={card.label} className="col-6 col-sm-6 col-md-4 col-lg">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-3">
                <span
                  className="card-subtitle text-secondary d-block text-uppercase fw-semibold mb-2 text-truncate"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
                  title={card.label}
                >
                  {card.label}
                </span>
                <div className={`fs-3 fw-bold text-${card.color} lh-1`}>
                  {card.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Middle Row: Difficulty Breakdown & Continue Practicing */}
      <div className="row g-3 mb-3 flex-grow-1" style={{ minHeight: "220px" }}>
        {/* Left Half: Difficulty Breakdown (Layered Easy, Medium, Hard) */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3 p-md-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Difficulty Breakdown
                </h6>
                <span className="text-muted small">
                  {completed} / {total} Solved
                </span>
              </div>

              {total === 0 ? (
                <div className="text-muted text-center py-4 small flex-grow-1 d-flex align-items-center justify-content-center">
                  Add questions to view difficulty progress.
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-between flex-grow-1 gap-2">
                  {difficulties.map((d) => {
                    const pct =
                      d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0;
                    return (
                      <div key={d.label} className="p-3 rounded bg-light border">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span
                            className={`badge ${difficultyBadge(d.label)} py-1 px-2`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {d.label}
                          </span>
                          <span
                            className="text-muted fw-medium"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {d.solved} / {d.total}{" "}
                            <span className="text-secondary">({pct}%)</span>
                          </span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar bg-${d.color}`}
                            role="progressbar"
                            style={{ width: `${pct}%` }}
                            aria-valuenow={pct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Half: Continue Practicing */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3 p-md-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Continue Practicing
                </h6>
                {unsolvedQuestions.length > 0 && (
                  <span
                    className="badge bg-primary-subtle text-primary-emphasis py-1 px-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {unsolvedQuestions.length} Next Up
                  </span>
                )}
              </div>

              {unsolvedQuestions.length === 0 ? (
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center py-4">
                  <p className="text-muted mb-0 small">
                    {total === 0
                      ? 'No questions added yet. Use "+ Add Question" above to get started!'
                      : "All caught up! You've solved all your added questions. 🎉"}
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-start gap-2 flex-grow-1">
                  {unsolvedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 rounded border bg-light d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer", transition: "all 0.15s ease-in-out" }}
                      onClick={() =>
                        onSelectQuestionForCoach && onSelectQuestionForCoach(q)
                      }
                      role="button"
                      title="Click to practice with DSA Coach"
                    >
                      <div className="me-2 overflow-hidden">
                        <div
                          className="fw-semibold text-truncate"
                          title={q.title}
                          style={{ fontSize: "0.925rem" }}
                        >
                          {q.questionNumber ? `#${q.questionNumber} ` : ""}
                          {q.title}
                        </div>
                        <div className="d-flex gap-2 flex-wrap mt-1">
                          {q.topic && (
                            <span
                              className="badge bg-secondary-subtle text-secondary-emphasis py-1 px-2"
                              style={{ fontSize: "0.725rem" }}
                            >
                              {q.topic}
                            </span>
                          )}
                          {q.difficulty && (
                            <span
                              className={`badge ${difficultyBadge(q.difficulty)} py-1 px-2`}
                              style={{ fontSize: "0.725rem" }}
                            >
                              {q.difficulty.charAt(0).toUpperCase() +
                                q.difficulty.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className="text-primary fw-semibold small text-nowrap d-flex align-items-center gap-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Coach &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Topics & Solved Today (Side by Side) */}
      <div className="row g-3 flex-grow-1" style={{ minHeight: "150px" }}>
        {/* Top Topics */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3 p-md-4 d-flex flex-column">
              <h6 className="card-title fw-bold mb-3" style={{ fontSize: "1rem" }}>
                Top Topics (Solved)
              </h6>
              {topTopics.length === 0 ? (
                <div className="text-muted text-center py-3 small flex-grow-1 d-flex align-items-center justify-content-center">
                  Solve questions to see top topics.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-start">
                  {topTopics.map(([topic, count], index) => (
                    <div
                      key={topic}
                      className="d-flex justify-content-between align-items-center py-2 px-3 rounded bg-light border"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <span className="text-truncate me-2">
                        <span
                          className="badge bg-secondary me-2 py-1 px-2"
                          style={{ fontSize: "0.725rem" }}
                        >
                          {index + 1}
                        </span>
                        <span className="fw-medium">{topic}</span>
                      </span>
                      <span
                        className="badge bg-success py-1 px-2 flex-shrink-0"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {count} solved
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Solved Today */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3 p-md-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Solved Today
                </h6>
                {solvedToday.length > 0 && (
                  <span
                    className="badge bg-success-subtle text-success-emphasis py-1 px-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {solvedToday.length} Solved Today
                  </span>
                )}
              </div>
              {solvedToday.length === 0 ? (
                <div className="text-muted text-center py-3 small flex-grow-1 d-flex align-items-center justify-content-center">
                  No questions solved today yet.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-start">
                  {solvedToday.map((q) => (
                    <div
                      key={q.id}
                      className="d-flex justify-content-between align-items-center py-2 px-3 rounded bg-light border"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <span className="fw-medium text-truncate me-2">
                        {q.questionNumber ? (
                          <span className="text-secondary me-1">
                            #{q.questionNumber}
                          </span>
                        ) : null}
                        {q.title}
                      </span>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        {q.topic && (
                          <span
                            className="badge bg-secondary-subtle text-secondary-emphasis py-1 px-2"
                            style={{ fontSize: "0.725rem" }}
                          >
                            {q.topic}
                          </span>
                        )}
                        {q.difficulty && (
                          <span
                            className={`badge ${difficultyBadge(q.difficulty)} py-1 px-2`}
                            style={{ fontSize: "0.725rem" }}
                          >
                            {q.difficulty.charAt(0).toUpperCase() +
                              q.difficulty.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSADashboard;

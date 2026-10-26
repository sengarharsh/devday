const SAMPLE_RECOMMENDATIONS = [
  {
    id: "sample-rec-1",
    questionNumber: 20,
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "easy",
    reason: "Reinforces foundational LIFO stack patterns following your recent practice.",
    completed: false,
  },
  {
    id: "sample-rec-2",
    questionNumber: 33,
    title: "Search in Rotated Sorted Array",
    topic: "Binary Search",
    difficulty: "medium",
    reason: "Recommended to strengthen binary search edge cases and boundary conditions.",
    completed: false,
  },
  {
    id: "sample-rec-3",
    questionNumber: 1,
    title: "Two Sum",
    topic: "Arrays & Hashing",
    difficulty: "easy",
    reason: "Core frequency counting and hash map lookup technique.",
    completed: true,
  },
];

const difficultyBadge = (difficulty) => {
  const colors = {
    easy: "bg-success",
    medium: "bg-warning text-dark",
    hard: "bg-danger",
  };
  return colors[difficulty?.toLowerCase()] || "bg-secondary";
};

const DSADashboard = ({ questions = [], onSelectQuestionForCoach }) => {
  const total = questions.length;
  const completed = questions.filter((q) => q.completed).length;
  const bookmarked = questions.filter((q) => q.bookmarked).length;
  const easy = questions.filter((q) => q.difficulty?.toLowerCase() === "easy").length;
  const medium = questions.filter((q) => q.difficulty?.toLowerCase() === "medium").length;
  const hard = questions.filter((q) => q.difficulty?.toLowerCase() === "hard").length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Top 5 topics by number of solved questions
  const topicCounts = {};
  questions.forEach((q) => {
    if (q.topic && q.completed) {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    }
  });
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent solved questions (last 5)
  const recentSolved = questions.filter((q) => q.completed).slice(0, 5);

  const statCards = [
    { label: "Total Questions", value: total, color: "primary" },
    { label: "Completed", value: completed, color: "success" },
    { label: "Bookmarked", value: bookmarked, color: "warning" },
    { label: "Completion %", value: `${completionPct}%`, color: "info" },
  ];

  const difficultyCards = [
    { label: "Easy", value: easy, color: "success" },
    { label: "Medium", value: medium, color: "warning" },
    { label: "Hard", value: hard, color: "danger" },
  ];

  return (
    <div>
      {/* Summary Stats */}
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="col-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <h6 className="text-muted small text-uppercase fw-semibold mb-2">
                  {card.label}
                </h6>
                <h3 className={`fw-bold text-${card.color} mb-0`}>{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended for You (AI Integration Preparation) */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Recommended for You</h5>
              <small className="text-muted">
                Targeted practice based on your solved topics and improvement areas
              </small>
            </div>
            <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
              Sample Preview (AI in V2)
            </span>
          </div>

          <div className="row g-3">
            {SAMPLE_RECOMMENDATIONS.map((rec) => {
              // Check if already completed in sample or in actual questions
              const isSolved =
                rec.completed ||
                questions.some(
                  (q) =>
                    q.completed &&
                    q.title?.toLowerCase() === rec.title?.toLowerCase()
                );

              return (
                <div key={rec.id} className="col-12 col-md-4">
                  <div
                    className={`p-3 rounded border h-100 d-flex flex-column justify-content-between ${
                      isSolved ? "bg-light opacity-75" : "bg-white"
                    }`}
                    style={{ cursor: isSolved ? "default" : "pointer" }}
                    onClick={() => {
                      if (!isSolved && onSelectQuestionForCoach) {
                        onSelectQuestionForCoach(rec);
                      }
                    }}
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="fw-semibold">
                          {rec.questionNumber && (
                            <span className="text-secondary me-1">
                              #{rec.questionNumber}
                            </span>
                          )}
                          {rec.title}
                        </span>
                        {isSolved ? (
                          <span className="badge bg-success">Solved</span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm py-0 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectQuestionForCoach) {
                                onSelectQuestionForCoach(rec);
                              }
                            }}
                          >
                            Coach &rarr;
                          </button>
                        )}
                      </div>

                      <div className="d-flex gap-2 flex-wrap mb-2">
                        {rec.topic && (
                          <span className="badge bg-secondary-subtle text-secondary-emphasis">
                            {rec.topic}
                          </span>
                        )}
                        {rec.difficulty && (
                          <span className={`badge ${difficultyBadge(rec.difficulty)}`}>
                            {rec.difficulty.charAt(0).toUpperCase() +
                              rec.difficulty.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-muted small mb-0 pt-2 border-top">
                      💡 <span>{rec.reason}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Difficulty Breakdown</h5>
          {total === 0 ? (
            <p className="text-muted mb-0">Add some questions to see the breakdown.</p>
          ) : (
            <div>
              {difficultyCards.map((d) => {
                const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div key={d.label} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium">{d.label}</span>
                      <span className="text-muted small">
                        {d.value} ({pct}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className={`progress-bar bg-${d.color}`}
                        role="progressbar"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="row g-3">
        {/* Top Topics */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Top Topics (Solved)</h5>
              {topTopics.length === 0 ? (
                <p className="text-muted mb-0">Solve questions to see your top topics.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {topTopics.map(([topic, count], index) => (
                    <div
                      key={topic}
                      className="d-flex justify-content-between align-items-center p-2 rounded bg-light border"
                    >
                      <span>
                        <span className="badge bg-secondary me-2">{index + 1}</span>
                        <span className="fw-medium">{topic}</span>
                      </span>
                      <span className="badge bg-success">{count} solved</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recently Solved */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Recently Solved</h5>
              {recentSolved.length === 0 ? (
                <p className="text-muted mb-0">No solved questions yet. Keep practicing! 💪</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {recentSolved.map((q) => (
                    <div
                      key={q.id}
                      className="d-flex justify-content-between align-items-center p-2 rounded bg-light border"
                    >
                      <span className="fw-medium">
                        {q.questionNumber && (
                          <span className="text-secondary me-1">#{q.questionNumber}</span>
                        )}
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`badge ${difficultyBadge(q.difficulty)}`}>
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </span>
                      )}
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

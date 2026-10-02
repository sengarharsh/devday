const DSADashboard = ({ questions }) => {
  const total = questions.length;
  const completed = questions.filter((q) => q.completed).length;
  const bookmarked = questions.filter((q) => q.bookmarked).length;
  const easy = questions.filter((q) => q.difficulty === "easy").length;
  const medium = questions.filter((q) => q.difficulty === "medium").length;
  const hard = questions.filter((q) => q.difficulty === "hard").length;
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
    { label: "Completion %", value: `${completionPct}%`, color: "info" }
  ];

  const difficultyCards = [
    { label: "Easy", value: easy, color: "success" },
    { label: "Medium", value: medium, color: "warning" },
    { label: "Hard", value: hard, color: "danger" }
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
                      <span className="text-muted small">{d.value} ({pct}%)</span>
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
                        <span
                          className={`badge bg-${
                            q.difficulty === "easy"
                              ? "success"
                              : q.difficulty === "medium"
                              ? "warning text-dark"
                              : "danger"
                          }`}
                        >
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

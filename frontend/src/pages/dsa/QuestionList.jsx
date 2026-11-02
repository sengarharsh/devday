import { useState } from "react";

const QuestionList = ({
  questions = [],
  emptyMessage = "No questions found.",
  onToggleComplete,
  onToggleBookmark,
  onEdit,
  onDelete,
  onSelectForCoach,
  processingId,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  if (questions.length === 0) {
    return <div className="text-center py-5 text-muted">{emptyMessage}</div>;
  }

  const difficultyBadge = (difficulty) => {
    const colors = {
      easy: "bg-success",
      medium: "bg-warning text-dark",
      hard: "bg-danger",
    };
    return colors[difficulty?.toLowerCase()] || "bg-secondary";
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="d-flex flex-column gap-2">
      {questions.map((q) => {
        const isProcessing = processingId === q.id;
        const isExpanded = expandedId === q.id;

        return (
          <div
            key={q.id}
            className={`rounded border transition-all ${
              q.completed ? "bg-light" : "bg-white"
            } ${isExpanded ? "shadow-sm border-primary" : ""}`}
          >
            {/* Main Question Row */}
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden me-3">
                <input
                  type="checkbox"
                  className="form-check-input mt-0 flex-shrink-0"
                  checked={q.completed}
                  onChange={() => onToggleComplete && onToggleComplete(q.id)}
                  disabled={isProcessing}
                  id={`dsa-q-${q.id}`}
                  title={q.completed ? "Mark as unsolved" : "Mark as solved"}
                  style={{ cursor: "pointer", width: "1.1rem", height: "1.1rem" }}
                />
                <div
                  className="overflow-hidden"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleExpand(q.id)}
                  role="button"
                  title="Click to view details & problem statement"
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span
                      className={`fw-semibold mb-0 ${
                        q.completed
                          ? "text-muted"
                          : "text-dark"
                      }`}
                    >
                      {q.questionNumber && (
                        <span className="text-secondary me-1">
                          #{q.questionNumber}
                        </span>
                      )}
                      {q.title}
                    </span>
                    <span
                      className="text-primary small"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {isExpanded ? "▲ Hide" : "▼ View Problem"}
                    </span>
                  </div>

                  <div className="mt-1 d-flex gap-2 flex-wrap align-items-center">
                    {q.topic && (
                      <span className="badge bg-secondary-subtle text-secondary-emphasis">
                        {q.topic}
                      </span>
                    )}
                    {q.difficulty && (
                      <span className={`badge ${difficultyBadge(q.difficulty)}`}>
                        {q.difficulty.charAt(0).toUpperCase() +
                          q.difficulty.slice(1)}
                      </span>
                    )}
                    {q.notes && (
                      <span
                        className="text-muted small"
                        style={{ fontSize: "0.78rem" }}
                      >
                        📝 Notes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                {/* Bookmark Button */}
                <button
                  type="button"
                  className={`btn btn-sm ${
                    q.bookmarked ? "btn-warning" : "btn-outline-warning"
                  }`}
                  onClick={() => onToggleBookmark && onToggleBookmark(q.id)}
                  disabled={isProcessing}
                  title={q.bookmarked ? "Remove bookmark" : "Bookmark question"}
                >
                  {q.bookmarked ? "★" : "☆"}
                </button>

                {/* Edit Button */}
                {onEdit && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => onEdit(q)}
                    disabled={isProcessing}
                    title="Edit question details"
                  >
                    Edit
                  </button>
                )}

                {/* Solved Status Badge / Toggle */}
                <span
                  className={`badge ${
                    q.completed
                      ? "bg-success"
                      : "bg-secondary-subtle text-secondary-emphasis"
                  } py-2 px-2`}
                  style={{ cursor: "pointer" }}
                  onClick={() => onToggleComplete && onToggleComplete(q.id)}
                  title="Click to toggle solved status"
                >
                  {q.completed ? "✓ Solved" : "Pending"}
                </span>

                {/* Delete Button */}
                {onDelete && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDelete(q.id)}
                    disabled={isProcessing}
                    title="Delete question"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Problem Statement & Notes Drawer */}
            {isExpanded && (
              <div className="border-top p-3 bg-light rounded-bottom">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0 text-primary" style={{ fontSize: "0.95rem" }}>
                    Problem Statement
                  </h6>
                  {onSelectForCoach && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                      onClick={() => onSelectForCoach(q)}
                    >
                      Practice in DSA Coach &rarr;
                    </button>
                  )}
                </div>

                <div
                  className="bg-white p-3 rounded border text-secondary mb-3"
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                    maxHeight: "350px",
                    overflowY: "auto",
                  }}
                >
                  {q.problemStatement || (
                    <span className="text-muted fst-italic">
                      No problem statement provided for this question.
                    </span>
                  )}
                </div>

                {q.notes && (
                  <div>
                    <h6 className="fw-bold mb-1 text-secondary" style={{ fontSize: "0.85rem" }}>
                      📝 Notes / Observations
                    </h6>
                    <div
                      className="bg-warning-subtle text-dark p-2 px-3 rounded border border-warning-subtle"
                      style={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}
                    >
                      {q.notes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;

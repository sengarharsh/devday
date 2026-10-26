import { useState, useEffect } from "react";
import {
  getSolvedDSAQuestions,
  updateDSAQuestionStatus,
  deleteDSAQuestion,
} from "../../api/api";
import QuestionList from "./QuestionList";

const SolvedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchSolvedQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSolvedDSAQuestions();
      setQuestions(data.filter((q) => q.completed));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load solved questions from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolvedQuestions();
  }, []);

  const handleToggleComplete = async (id) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      setProcessingId(id);
      setError(null);
      const nextCompleted = !question.completed;
      await updateDSAQuestionStatus(id, { completed: nextCompleted });

      // If uncompleted, remove from Solved view; otherwise update in place
      if (!nextCompleted) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update completion status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleBookmark = async (id) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      setProcessingId(id);
      setError(null);
      const nextBookmarked = !question.bookmarked;
      await updateDSAQuestionStatus(id, { bookmarked: nextBookmarked });

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, bookmarked: nextBookmarked } : q
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update bookmark status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setProcessingId(id);
      setError(null);
      await deleteDSAQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete question."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title fw-bold mb-0">Solved Questions</h5>
          <span className="badge bg-success">{questions.length} Solved</span>
        </div>

        {/* Error Alert with Retry */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center mb-3"
            role="alert"
          >
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchSolvedQuestions}
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></div>
            Loading solved questions...
          </div>
        ) : (
          <QuestionList
            questions={questions}
            emptyMessage="No solved questions yet. Keep practicing! 💪"
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onDelete={handleDelete}
            processingId={processingId}
          />
        )}
      </div>
    </div>
  );
};

export default SolvedQuestions;

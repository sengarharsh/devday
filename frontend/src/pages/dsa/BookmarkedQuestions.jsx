import { useState, useEffect } from "react";
import {
  getBookmarkedDSAQuestions,
  updateDSAQuestionStatus,
  deleteDSAQuestion,
} from "../../api/api";
import QuestionList from "./QuestionList";

const BookmarkedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchBookmarkedQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookmarkedDSAQuestions();
      setQuestions(data.filter((q) => q.bookmarked));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load bookmarked questions from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedQuestions();
  }, []);

  const handleToggleBookmark = async (id) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      setProcessingId(id);
      setError(null);
      const nextBookmarked = !question.bookmarked;
      await updateDSAQuestionStatus(id, { bookmarked: nextBookmarked });

      // If unbookmarked, remove from Bookmarked view; otherwise update in place
      if (!nextBookmarked) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, bookmarked: true } : q))
        );
      }
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

  const handleToggleComplete = async (id) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      setProcessingId(id);
      setError(null);
      const nextCompleted = !question.completed;
      await updateDSAQuestionStatus(id, { completed: nextCompleted });

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, completed: nextCompleted } : q
        )
      );
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
          <h5 className="card-title fw-bold mb-0">Bookmarked Questions</h5>
          <span className="badge bg-warning text-dark">
            {questions.length} Bookmarked
          </span>
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
              onClick={fetchBookmarkedQuestions}
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
            Loading bookmarked questions...
          </div>
        ) : (
          <QuestionList
            questions={questions}
            emptyMessage="No bookmarked questions. Bookmark questions you want to revisit! ⭐"
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

export default BookmarkedQuestions;

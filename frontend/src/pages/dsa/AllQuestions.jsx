import { useState, useEffect } from "react";
import {
  getAllDSAQuestions,
  updateDSAQuestionStatus,
  deleteDSAQuestion,
} from "../../api/api";
import QuestionList from "./QuestionList";

const AllQuestions = ({ onQuestionsChange, refreshTrigger }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDSAQuestions();
      setQuestions(data);
      if (onQuestionsChange) {
        onQuestionsChange(data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load questions from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [refreshTrigger]);

  const handleToggleComplete = async (id) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      setProcessingId(id);
      setError(null);
      const nextCompleted = !question.completed;
      await updateDSAQuestionStatus(id, { completed: nextCompleted });

      setQuestions((prev) => {
        const updated = prev.map((q) =>
          q.id === id ? { ...q, completed: nextCompleted } : q
        );
        if (onQuestionsChange) onQuestionsChange(updated);
        return updated;
      });
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

      setQuestions((prev) => {
        const updated = prev.map((q) =>
          q.id === id ? { ...q, bookmarked: nextBookmarked } : q
        );
        if (onQuestionsChange) onQuestionsChange(updated);
        return updated;
      });
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
      setQuestions((prev) => {
        const updated = prev.filter((q) => q.id !== id);
        if (onQuestionsChange) onQuestionsChange(updated);
        return updated;
      });
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

  // Filter questions based on search and difficulty
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      !searchQuery.trim() ||
      q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.questionNumber && String(q.questionNumber).includes(searchQuery.trim()));

    const matchesDifficulty =
      filterDifficulty === "all" ||
      q.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title fw-bold mb-0">Question List</h5>
          <span className="badge bg-primary">{questions.length} Total</span>
        </div>

        {/* Filter / Search Bar */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-8">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by title, topic, or question #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select form-select-sm"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
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
              onClick={fetchQuestions}
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
            Loading questions...
          </div>
        ) : (
          <QuestionList
            questions={filteredQuestions}
            emptyMessage={
              questions.length === 0
                ? "No questions added yet. Click 'Add Question' to get started! 🚀"
                : "No questions match your filter criteria."
            }
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

export default AllQuestions;

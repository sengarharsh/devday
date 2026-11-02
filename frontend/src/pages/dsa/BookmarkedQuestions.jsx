import { useState, useEffect, useMemo } from "react";
import {
  getBookmarkedDSAQuestions,
  updateDSAQuestionStatus,
  deleteDSAQuestion,
} from "../../api/api";
import QuestionList from "./QuestionList";
import AddQuestionModal from "./AddQuestionModal";

const BookmarkedQuestions = ({
  onSelectQuestionForCoach,
  onQuestionsChange,
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterTopic, setFilterTopic] = useState("all");

  // Edit Modal
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchBookmarkedQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookmarkedDSAQuestions();
      const bookmarked = (data || []).filter((q) => q.bookmarked);
      setQuestions(bookmarked);
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

      // If unbookmarked, remove from Bookmarked view
      if (!nextBookmarked) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, bookmarked: true } : q))
        );
      }
      if (onQuestionsChange) onQuestionsChange();
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
      if (onQuestionsChange) onQuestionsChange();
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
      if (onQuestionsChange) onQuestionsChange();
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

  const handleOpenEdit = (question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleSaveEdited = (updatedQuestion) => {
    if (!updatedQuestion.bookmarked) {
      setQuestions((prev) => prev.filter((q) => q.id !== updatedQuestion.id));
    } else {
      setQuestions((prev) =>
        prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
      );
    }
    if (onQuestionsChange) onQuestionsChange();
    setEditingQuestion(null);
    setIsEditModalOpen(false);
  };

  // Distinct Topics among bookmarked questions
  const uniqueTopics = useMemo(() => {
    const set = new Set();
    questions.forEach((q) => {
      if (q.topic?.trim()) set.add(q.topic.trim());
    });
    return Array.from(set).sort();
  }, [questions]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        q.title?.toLowerCase().includes(query) ||
        q.topic?.toLowerCase().includes(query) ||
        q.problemStatement?.toLowerCase().includes(query) ||
        q.notes?.toLowerCase().includes(query) ||
        (q.questionNumber && String(q.questionNumber).includes(query));

      const matchesDifficulty =
        filterDifficulty === "all" ||
        q.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();

      const matchesTopic =
        filterTopic === "all" ||
        q.topic?.toLowerCase() === filterTopic.toLowerCase();

      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [questions, searchQuery, filterDifficulty, filterTopic]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filterDifficulty !== "all" ||
    filterTopic !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDifficulty("all");
    setFilterTopic("all");
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3 p-md-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title fw-bold mb-0">Bookmarked Questions</h5>
            <small className="text-muted">
              Quick access to starred questions for revision and coaching.
            </small>
          </div>
          <span className="badge bg-warning text-dark py-1 px-2">
            ⭐ {filteredQuestions.length} of {questions.length} Bookmarked
          </span>
        </div>

        {/* Filter Bar */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-5">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search bookmarked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
            >
              <option value="all">All Topics</option>
              {uniqueTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
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
          <div className="col-12 col-md-1">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
            >
              Reset
            </button>
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
            questions={filteredQuestions}
            emptyMessage={
              questions.length === 0
                ? "No bookmarked questions yet. Star any question to save it for revision! ⭐"
                : "No bookmarked questions match your filter criteria."
            }
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onSelectForCoach={onSelectQuestionForCoach}
            processingId={processingId}
          />
        )}

        {/* Edit Modal */}
        <AddQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveEdited}
          editingQuestion={editingQuestion}
        />
      </div>
    </div>
  );
};

export default BookmarkedQuestions;

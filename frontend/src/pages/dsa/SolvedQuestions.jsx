import { useState, useEffect, useMemo } from "react";
import {
  getSolvedDSAQuestions,
  updateDSAQuestionStatus,
  deleteDSAQuestion,
} from "../../api/api";
import QuestionList from "./QuestionList";
import AddQuestionModal from "./AddQuestionModal";

const SolvedQuestions = ({ onSelectQuestionForCoach, onQuestionsChange }) => {
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

  const fetchSolvedQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSolvedDSAQuestions();
      const solved = (data || []).filter((q) => q.completed);
      setQuestions(solved);
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

      // If uncompleted, remove from Solved view
      if (!nextCompleted) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
        );
      }
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
    if (!updatedQuestion.completed) {
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

  // Unique Topics among solved questions
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
            <h5 className="card-title fw-bold mb-0">Solved Questions</h5>
            <small className="text-muted">
              Review completed problems and revise problem statements.
            </small>
          </div>
          <span className="badge bg-success py-1 px-2">
            {filteredQuestions.length} of {questions.length} Solved
          </span>
        </div>

        {/* Filter Bar */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-5">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search solved questions..."
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
            questions={filteredQuestions}
            emptyMessage={
              questions.length === 0
                ? "No solved questions yet. Keep practicing! 💪"
                : "No solved questions match your filter criteria."
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

export default SolvedQuestions;

import { useState, useEffect, useMemo } from "react";
import {
  getAllDSAQuestions,
  updateDSAQuestionStatus,
  deleteDSAQuestion,
} from "../../api/api";
import QuestionList from "./QuestionList";
import AddQuestionModal from "./AddQuestionModal";

const AllQuestions = ({
  onQuestionsChange,
  refreshTrigger,
  onSelectQuestionForCoach,
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterTopic, setFilterTopic] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "solved" | "unsolved"

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleOpenEdit = (question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleSaveEdited = (updatedQuestion) => {
    setQuestions((prev) => {
      const updated = prev.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );
      if (onQuestionsChange) onQuestionsChange(updated);
      return updated;
    });
    setEditingQuestion(null);
    setIsEditModalOpen(false);
  };

  // Distinct Topics for topic filter dropdown
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

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "solved" && q.completed) ||
        (filterStatus === "unsolved" && !q.completed);

      return (
        matchesSearch && matchesDifficulty && matchesTopic && matchesStatus
      );
    });
  }, [questions, searchQuery, filterDifficulty, filterTopic, filterStatus]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filterDifficulty !== "all" ||
    filterTopic !== "all" ||
    filterStatus !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDifficulty("all");
    setFilterTopic("all");
    setFilterStatus("all");
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3 p-md-4">
        {/* Header with Metrics */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title fw-bold mb-0">Question List</h5>
            <small className="text-muted">
              Browse, filter, and manage your DSA questions. Click any question to read the problem statement.
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary-emphasis py-1 px-2">
              {filteredQuestions.length} of {questions.length} Questions
            </span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="row g-2 mb-3">
          {/* Search by Title */}
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by title, topic, or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter by Topic */}
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

          {/* Filter by Difficulty */}
          <div className="col-6 col-md-2">
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

          {/* Filter by Solved / Unsolved */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="col-6 col-md-1">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              title="Reset all filters"
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
                ? "No questions added yet. Click '+ Add Question' above to get started! 🚀"
                : "No questions match your filter criteria."
            }
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onSelectForCoach={onSelectQuestionForCoach}
            processingId={processingId}
          />
        )}

        {/* Edit Question Modal */}
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

export default AllQuestions;

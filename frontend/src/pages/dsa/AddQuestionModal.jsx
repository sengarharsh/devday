import { useState, useEffect } from "react";
import { createDSAQuestion, updateDSAQuestion } from "../../api/api";

const AddQuestionModal = ({ isOpen, onClose, onSave, editingQuestion = null }) => {
  const [questionNumber, setQuestionNumber] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState(null); // "save" | "bookmark"
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (editingQuestion) {
        setQuestionNumber(
          editingQuestion.questionNumber != null
            ? String(editingQuestion.questionNumber)
            : ""
        );
        setTitle(editingQuestion.title || "");
        setTopic(editingQuestion.topic || "");
        setDifficulty(editingQuestion.difficulty?.toLowerCase() || "");
        setProblemStatement(editingQuestion.problemStatement || "");
        setNotes(editingQuestion.notes || "");
        setError(null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingQuestion]);

  if (!isOpen) return null;

  const resetForm = () => {
    setQuestionNumber("");
    setTitle("");
    setTopic("");
    setDifficulty("");
    setProblemStatement("");
    setNotes("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveQuestion = async (isBookmarked) => {
    if (!title.trim()) {
      setError("Question title is required.");
      return;
    }

    if (!problemStatement.trim()) {
      setError("Problem statement is required.");
      return;
    }

    const parsedQuestionNumber = questionNumber.trim()
      ? parseInt(questionNumber.trim(), 10)
      : null;

    const payload = {
      title: title.trim(),
      questionNumber: isNaN(parsedQuestionNumber) ? null : parsedQuestionNumber,
      topic: topic.trim() || null,
      difficulty: difficulty || null,
      problemStatement: problemStatement.trim(),
      notes: notes.trim() || null,
      completed: editingQuestion ? editingQuestion.completed : false,
      bookmarked:
        isBookmarked !== undefined
          ? isBookmarked
          : editingQuestion
          ? editingQuestion.bookmarked
          : false,
    };

    try {
      setSubmitting(true);
      setSubmitType(isBookmarked ? "bookmark" : "save");
      setError(null);

      let saved;
      if (editingQuestion) {
        saved = await updateDSAQuestion(editingQuestion.id, payload);
      } else {
        saved = await createDSAQuestion(payload);
      }

      resetForm();
      if (onSave) {
        onSave(saved);
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save question. Please check backend connection."
      );
    } finally {
      setSubmitting(false);
      setSubmitType(null);
    }
  };

  const isFormValid = Boolean(title.trim() && problemStatement.trim());

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content shadow border-0">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">
              {editingQuestion ? "Edit DSA Question" : "Add New DSA Question"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
              disabled={submitting}
            ></button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveQuestion(
                editingQuestion ? editingQuestion.bookmarked : false
              );
            }}
          >
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-semibold small">
                    Question Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Two Sum"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={submitting}
                    autoFocus
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">
                    Question Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 1"
                    value={questionNumber}
                    onChange={(e) => setQuestionNumber(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Topic</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Arrays & Hashing, Dynamic Programming"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Difficulty</label>
                  <select
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Problem Statement (Required) */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Problem Statement <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Include the problem description, example inputs and outputs, requirements, constraints, and edge cases..."
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Notes / Tips (Optional) */}
              <div className="mb-2">
                <label className="form-label fw-semibold small">
                  Notes / Tips <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Key observations, approach ideas, time/space complexity goals..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </button>
              {!editingQuestion && (
                <button
                  type="button"
                  className="btn btn-outline-warning"
                  onClick={() => handleSaveQuestion(true)}
                  disabled={submitting || !isFormValid}
                >
                  {submitting && submitType === "bookmark"
                    ? "Saving..."
                    : "★ Bookmark & Save"}
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !isFormValid}
              >
                {submitting && submitType === "save"
                  ? "Saving..."
                  : editingQuestion
                  ? "Update Question"
                  : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;

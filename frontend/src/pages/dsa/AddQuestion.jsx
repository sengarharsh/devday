import { useState } from "react";

const AddQuestion = ({ onSave, onCancel }) => {
  const [questionNumber, setQuestionNumber] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newQuestion = {
      id: Date.now().toString(),
      questionNumber: questionNumber.trim(),
      title: title.trim(),
      topic: topic.trim(),
      difficulty,
      notes: notes.trim(),
      completed: false,
      bookmarked: false
    };

    onSave(newQuestion);
    setQuestionNumber("");
    setTitle("");
    setTopic("");
    setDifficulty("");
    setNotes("");
  };

  const handleBookmarkAndSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newQuestion = {
      id: Date.now().toString(),
      questionNumber: questionNumber.trim(),
      title: title.trim(),
      topic: topic.trim(),
      difficulty,
      notes: notes.trim(),
      completed: false,
      bookmarked: true
    };

    onSave(newQuestion);
    setQuestionNumber("");
    setTitle("");
    setTopic("");
    setDifficulty("");
    setNotes("");
  };

  const handleCancel = () => {
    setQuestionNumber("");
    setTitle("");
    setTopic("");
    setDifficulty("");
    setNotes("");
    if (onCancel) onCancel();
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h5 className="card-title fw-bold mb-3">Add New Question</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Question title (e.g. Two Sum)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Question No."
                value={questionNumber}
                onChange={(e) => setQuestionNumber(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Topic (e.g. Linked List)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-4 my-3">
            <select
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="col-12 col-md-8 my-3">
            <label className="form-label fw-medium">Notes</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Points to remember (e.g. Use two pointer)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleBookmarkAndSave}
            >
              Bookmark &amp; Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;

import { useState } from "react";

const difficultyBadge = (difficulty) => {
  const colors = {
    easy: "bg-success",
    medium: "bg-warning text-dark",
    hard: "bg-danger",
  };
  return colors[difficulty?.toLowerCase()] || "bg-secondary";
};

const DSACoach = ({ selectedQuestion, onClearSelectedQuestion }) => {
  const [input, setInput] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "coach",
      text: "Welcome to DSA Coach! 👋\n\nPaste a problem statement or describe a DSA problem, and we'll work through it together step by step.\n\nI won't give you the answer directly — instead, I'll guide you with hints so you truly learn the approach.",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    };

    const coachReply = {
      id: (Date.now() + 1).toString(),
      role: "coach",
      text: "🚧 AI coaching will be connected once the question workflow is finalized.\n\nPlanned AI Capabilities:\n1. Problem breakdown & edge case analysis\n2. Guiding hints without spoiling the full solution\n3. Time and space complexity trade-offs\n4. Code review & test case debugging",
    };

    setMessages((prev) => [...prev, userMessage, coachReply]);
    setInput("");
  };

  return (
    <div
      className="card shadow-sm border-0 overflow-hidden"
      style={{ height: "70vh" }}
    >
      <div className="card-header bg-white border-bottom">
        <h5 className="fw-bold mb-0">DSA Coach</h5>
        <small className="text-muted">
          Work through problems step-by-step with guided hints
        </small>
      </div>

      {/* Active Problem Banner */}
      {selectedQuestion && (
        <div className="bg-primary-subtle border-bottom px-3 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="badge bg-primary">Active Problem</span>
              <span className="fw-semibold">
                {selectedQuestion.questionNumber
                  ? `#${selectedQuestion.questionNumber} `
                  : ""}
                {selectedQuestion.title}
              </span>
              {selectedQuestion.topic && (
                <span className="badge bg-secondary-subtle text-secondary-emphasis">
                  {selectedQuestion.topic}
                </span>
              )}
              {selectedQuestion.difficulty && (
                <span
                  className={`badge ${difficultyBadge(
                    selectedQuestion.difficulty
                  )}`}
                >
                  {selectedQuestion.difficulty.charAt(0).toUpperCase() +
                    selectedQuestion.difficulty.slice(1)}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              {selectedQuestion.problemStatement && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowProblemStatement((prev) => !prev)}
                >
                  {showProblemStatement ? "Hide Problem" : "View Problem"}
                </button>
              )}
              {onClearSelectedQuestion && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onClearSelectedQuestion}
                  title="Clear active problem"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {showProblemStatement && selectedQuestion.problemStatement && (
            <div
              className="mt-2 p-2 px-3 bg-white rounded border small text-secondary"
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedQuestion.problemStatement}
            </div>
          )}
        </div>
      )}

      {/* Chat Messages */}
      <div className="card-body overflow-auto d-flex flex-column gap-3 p-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex ${
              msg.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`p-3 rounded-3 ${
                msg.role === "user" ? "bg-primary text-white" : "bg-light border"
              }`}
              style={{ maxWidth: "75%", whiteSpace: "pre-line" }}
            >
              {msg.role === "coach" && (
                <small className="d-block fw-bold text-secondary mb-1">
                  🤖 Coach
                </small>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="card-footer bg-white border-top p-3">
        <form onSubmit={handleSend} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Ask a question or explain your approach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DSACoach;

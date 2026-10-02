import { useState } from "react";

const DSACoach = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "coach",
      text: "Welcome to DSA Coach! 👋\n\nPaste a problem statement or describe a DSA problem, and we'll work through it together step by step.\n\nI won't give you the answer directly — instead, I'll guide you with hints so you truly learn the approach."
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim()
    };

    const coachReply = {
      id: (Date.now() + 1).toString(),
      role: "coach",
      text: "🚧 AI coaching is not connected yet. This is a placeholder response.\n\nOnce integrated, I'll help you:\n1. Understand the problem\n2. Think through a brute-force approach\n3. Work toward the optimal solution with hints\n4. Write and review your code"
    };

    setMessages((prev) => [...prev, userMessage, coachReply]);
    setInput("");
  };

  return (
    <div className="card shadow-sm border-0" style={{ height: "70vh" }}>
      <div className="card-header bg-white border-bottom">
        <h5 className="fw-bold mb-0">DSA Coach</h5>
        <small className="text-muted">Work through problems step-by-step with guided hints</small>
      </div>

      {/* Chat Messages */}
      <div className="card-body overflow-auto d-flex flex-column gap-3 p-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-3 rounded-3 ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-light border"
              }`}
              style={{ maxWidth: "75%", whiteSpace: "pre-line" }}
            >
              {msg.role === "coach" && (
                <small className="d-block fw-bold text-secondary mb-1">🤖 Coach</small>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="card-footer bg-white border-top p-3">
        <form onSubmit={handleSend} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Describe a problem or paste a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DSACoach;

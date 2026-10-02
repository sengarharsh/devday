import { useState } from "react";
import DSADashboard from "./dsa/DSADashboard";
import AddQuestion from "./dsa/AddQuestion";
import DSACoach from "./dsa/DSACoach";
import SolvedQuestions from "./dsa/SolvedQuestions";
import BookmarkedQuestions from "./dsa/BookmarkedQuestions";

const tabs = [
  { key: "dashboard", label: "DSA Dashboard" },
  { key: "add", label: "Add Question" },
  { key: "coach", label: "DSA Coach" },
  { key: "solved", label: "Solved Questions" },
  { key: "bookmarked", label: "Bookmarked Questions" }
];

const DSA = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [questions, setQuestions] = useState([]);

  const handleSave = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleToggleComplete = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    );
  };

  const handleToggleBookmark = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, bookmarked: !q.bookmarked } : q))
    );
  };

  const handleDelete = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DSADashboard questions={questions} />;
      case "add":
        return <AddQuestion onSave={handleSave} />;
      case "coach":
        return <DSACoach />;
      case "solved":
        return (
          <SolvedQuestions
            questions={questions}
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onDelete={handleDelete}
          />
        );
      case "bookmarked":
        return (
          <BookmarkedQuestions
            questions={questions}
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onDelete={handleDelete}
          />
        );
      default:
        return <DSADashboard questions={questions} />;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">DSA</h2>
        <p className="text-muted mb-0">Add Questions and Manage your Daily Practice</p>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Active Tab Content */}
      {renderTab()}
    </div>
  );
};

export default DSA;
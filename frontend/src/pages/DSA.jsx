import { useState, useEffect } from "react";
import DSADashboard from "./dsa/DSADashboard";
import AllQuestions from "./dsa/AllQuestions";
import DSACoach from "./dsa/DSACoach";
import SolvedQuestions from "./dsa/SolvedQuestions";
import BookmarkedQuestions from "./dsa/BookmarkedQuestions";
import AddQuestionModal from "./dsa/AddQuestionModal";
import { getAllDSAQuestions } from "../api/api";

const tabs = [
  { key: "dashboard", label: "DSA Dashboard" },
  { key: "questions", label: "Question List" },
  { key: "coach", label: "DSA Coach" },
  { key: "solved", label: "Solved Questions" },
  { key: "bookmarked", label: "Bookmarked Questions" }
];

const DSA = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionForCoach, setSelectedQuestionForCoach] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchQuestions = async () => {
    try {
      const data = await getAllDSAQuestions();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to fetch DSA questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [activeTab, refreshKey]);

  const handleSave = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
    setRefreshKey((prev) => prev + 1);
  };

  const handleSelectQuestionForCoach = (question) => {
    setSelectedQuestionForCoach(question);
    setActiveTab("coach");
  };

  const handleClearSelectedQuestion = () => {
    setSelectedQuestionForCoach(null);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DSADashboard
            questions={questions}
            onSelectQuestionForCoach={handleSelectQuestionForCoach}
          />
        );
      case "questions":
        return (
          <AllQuestions
            onQuestionsChange={setQuestions}
            refreshTrigger={refreshKey}
          />
        );
      case "coach":
        return (
          <DSACoach
            selectedQuestion={selectedQuestionForCoach}
            onClearSelectedQuestion={handleClearSelectedQuestion}
          />
        );
      case "solved":
        return <SolvedQuestions />;
      case "bookmarked":
        return <BookmarkedQuestions />;
      default:
        return (
          <DSADashboard
            questions={questions}
            onSelectQuestionForCoach={handleSelectQuestionForCoach}
          />
        );
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">DSA</h2>
          <p className="text-muted mb-0">Manage your Daily Practice & Questions</p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span>+</span> Add Question
        </button>
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

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default DSA;

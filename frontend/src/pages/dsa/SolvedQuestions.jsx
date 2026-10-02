import QuestionList from "./QuestionList";

const SolvedQuestions = ({ questions, onToggleComplete, onToggleBookmark, onDelete }) => {
  const solved = questions.filter((q) => q.completed);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title fw-bold mb-0">Solved Questions</h5>
          <span className="badge bg-success">{solved.length} Solved</span>
        </div>
        <QuestionList
          questions={solved}
          emptyMessage="No solved questions yet. Keep practicing! 💪"
          onToggleComplete={onToggleComplete}
          onToggleBookmark={onToggleBookmark}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default SolvedQuestions;

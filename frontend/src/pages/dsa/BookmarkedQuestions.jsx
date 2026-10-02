import QuestionList from "./QuestionList";

const BookmarkedQuestions = ({ questions, onToggleComplete, onToggleBookmark, onDelete }) => {
  const bookmarked = questions.filter((q) => q.bookmarked);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title fw-bold mb-0">Bookmarked Questions</h5>
          <span className="badge bg-warning text-dark">{bookmarked.length} Bookmarked</span>
        </div>
        <QuestionList
          questions={bookmarked}
          emptyMessage="No bookmarked questions. Bookmark questions you want to revisit! ⭐"
          onToggleComplete={onToggleComplete}
          onToggleBookmark={onToggleBookmark}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default BookmarkedQuestions;

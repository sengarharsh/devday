const TaskSummaryCards = ({ activeCount, completedTodayCount, dailyTasksTotal, dailyTasksCompleted }) => {
  return (
    <div className="row g-3 mb-4">
      {/* Active Tasks Card */}
      <div className="col-12 col-md-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h6 className="card-subtitle text-secondary mb-2 small text-uppercase fw-semibold">
              Active Tasks
            </h6>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="card-title fw-bold mb-0 text-primary">{activeCount}</h3>
              <span className="text-muted small">to do</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Today Card */}
      <div className="col-12 col-md-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h6 className="card-subtitle text-secondary mb-2 small text-uppercase fw-semibold">
              Completed Today
            </h6>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="card-title fw-bold mb-0 text-success">{completedTodayCount}</h3>
              <span className="text-muted small">done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tasks Card */}
      <div className="col-12 col-md-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h6 className="card-subtitle text-secondary mb-2 small text-uppercase fw-semibold">
              Daily Tasks
            </h6>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="card-title fw-bold mb-0 text-info">
                {dailyTasksCompleted} / {dailyTasksTotal}
              </h3>
              <span className="text-muted small">completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSummaryCards;

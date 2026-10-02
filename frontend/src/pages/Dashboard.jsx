const summaryCards = [
  { id: "tasks", title: "Tasks", value: "3/5 Completed" },
  { id: "dsa", title: "DSA Problems", value: "2 Solved" },
  { id: "learning-time", title: "Learning Time", value: "3.5 hrs" },
  { id: "streak", title: "Current Streak", value: "5 Days 🔥" }
];

const sampleTasks = [
  { id: 1, title: "Build DevDay Dashboard component", category: "Project", status: "In Progress" },
  { id: 2, title: "Solve Two Sum problem", category: "DSA", status: "Completed" },
  { id: 3, title: "Review React Component State basics", category: "React", status: "Pending" }
];

const sampleActivities = [
  { id: 1, name: "React", duration: "1 hr 30 mins" },
  { id: 2, name: "DSA", duration: "1 hr" },
  { id: 3, name: "Java", duration: "45 mins" },
  { id: 4, name: "Project", duration: "1 hr 15 mins" }
];

const Dashboard = () => {
  return (
    <div>
      {/* 1. Welcome Section */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Welcome back 👋</h2>
        <p className="text-muted mb-0">
          Here's your development progress for today.
        </p>
      </div>

      {/* 2. Today's Summary Cards */}
      <div className="row g-3 mb-4">
        {summaryCards.map((card) => (
          <div key={card.id} className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="card-subtitle text-secondary mb-2 small text-uppercase fw-semibold">
                  {card.title}
                </h6>
                <h4 className="card-title fw-bold mb-0">{card.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Today's Tasks Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Today's Tasks</h5>
          <div className="d-flex flex-column gap-2">
            {sampleTasks.map((task) => (
              <div
                key={task.id}
                className="d-flex justify-content-between align-items-center p-3 rounded bg-light border"
              >
                <div>
                  <span className="fw-semibold me-2">{task.title}</span>
                  <span className="badge bg-secondary-subtle text-secondary">
                    {task.category}
                  </span>
                </div>
                <span
                  className={`badge ${
                    task.status === "Completed" ? "bg-success" : "bg-warning text-dark"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Today's Activity Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Today's Activity</h5>
          <div className="d-flex flex-column gap-2">
            {sampleActivities.map((activity) => (
              <div
                key={activity.id}
                className="d-flex justify-content-between align-items-center p-3 rounded bg-light border"
              >
                <span className="fw-semibold">{activity.name}</span>
                <span className="text-secondary">{activity.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

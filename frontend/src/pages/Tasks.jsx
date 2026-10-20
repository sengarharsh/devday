import { useState, useEffect } from "react";

const CATEGORIES = ["DSA", "React", "Java", "Project", "Other"];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Tasks = ({ initialTasks = [] } = {}) => {
  const [tasks, setTasks] = useState(() => {
    const today = getTodayDateString();
    return initialTasks.map((task) =>
      task.isDaily && task.completed && task.lastCompletedDate !== today
        ? { ...task, completed: false, lastCompletedDate: null }
        : task
    );
  });
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("React");
  const [isDaily, setIsDaily] = useState(false);

  const checkAndResetDailyTasks = () => {
    const today = getTodayDateString();
    setTasks((prevTasks) => {
      let hasChanges = false;
      const updated = prevTasks.map((task) => {
        if (task.isDaily && task.completed && task.lastCompletedDate !== today) {
          hasChanges = true;
          return { ...task, completed: false, lastCompletedDate: null };
        }
        return task;
      });
      return hasChanges ? updated : prevTasks;
    });
  };

  useEffect(() => {
    checkAndResetDailyTasks();

    let timeoutId;
    const scheduleMidnightReset = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 100
      );
      const msUntilMidnight = Math.max(nextMidnight.getTime() - now.getTime(), 1000);

      timeoutId = setTimeout(() => {
        checkAndResetDailyTasks();
        scheduleMidnightReset();
      }, msUntilMidnight);
    };

    scheduleMidnightReset();

    const handleVisibilityOrFocus = () => {
      checkAndResetDailyTasks();
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      isDaily,
      completed: false,
      lastCompletedDate: null
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTitle("");
    setIsDaily(false);
  };

  const handleToggleTask = (id) => {
    const today = getTodayDateString();
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== id) return task;
        const nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          lastCompletedDate: task.isDaily && nextCompleted ? today : null
        };
      })
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tasks</h2>
        <p className="text-muted mb-0">Manage and track your daily development tasks.</p>
      </div>

      {/* Task Creation Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Add New Task</h5>
          <form onSubmit={handleAddTask}>
            <div className="row g-2">
              <div className="col-12 col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task title (e.g., Practice Binary Search)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  Add Task
                </button>
              </div>
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isDailyTask"
                checked={isDaily}
                onChange={(e) => setIsDaily(e.target.checked)}
              />
              <label className="form-check-label text-muted" htmlFor="isDailyTask">
                Daily Task <span className="small text-muted">(resets at midnight)</span>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title fw-bold mb-0">Your Tasks</h5>
            <span className="badge bg-secondary">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No tasks yet. Add a task above to get started!
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`d-flex justify-content-between align-items-center p-3 rounded border ${
                    task.completed ? "bg-light opacity-75" : "bg-white"
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      id={`task-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`form-check-label mb-0 ${
                        task.completed ? "text-decoration-line-through text-muted" : "fw-medium"
                      }`}
                      role="button"
                    >
                      {task.title}
                    </label>
                    <span className="badge bg-secondary-subtle text-secondary-emphasis">
                      {task.category}
                    </span>
                    {task.isDaily && (
                      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
                        Daily
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${
                        task.completed ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;

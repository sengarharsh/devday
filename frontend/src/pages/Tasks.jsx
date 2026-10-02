import { useState } from "react";

const CATEGORIES = ["DSA", "React", "Java", "Project", "Other"]

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("React")

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      completed: false
    }

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTitle("")
  }

  const handleToggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

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

import { useState, useEffect, useMemo } from "react";
import { getAllTasks, createTask, updateTask, deleteTask } from "../api/api";
import TaskModal from "../components/tasks/TaskModal";
import TaskSummaryCards from "../components/tasks/TaskSummaryCards";
import TaskItem from "../components/tasks/TaskItem";

const CATEGORIES = ["DSA", "React", "Java", "Project", "Other"];

const isToday = (dateString) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const isPreviousDay = (dateString) => {
  if (!dateString) return true; // Missing createdAt safely treated as prior/history
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return true;
  const now = new Date();
  const taskDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return taskDate.getTime() < todayDate.getTime();
};

const getLocalDateKey = (dateString) => {
  if (!dateString) return "Prior Tasks (No Date)";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Prior Tasks (No Date)";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState("active"); // "active" | "completed_today" | "history"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load tasks from server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = async (taskPayload) => {
    const created = await createTask(taskPayload);
    setTasks((prevTasks) => [created, ...prevTasks]);
  };

  const handleToggleTask = async (task) => {
    try {
      setProcessingId(task.id);
      setError(null);
      const nextCompleted = !task.completed;
      const updatedData = {
        ...task,
        completed: nextCompleted,
      };
      const updated = await updateTask(task.id, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updated : t))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update task completion"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setProcessingId(id);
      setError(null);
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete task"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // 1. Active: incomplete tasks created today
  const activeTasks = useMemo(() => {
    return tasks.filter((t) => !t.completed && isToday(t.createdAt));
  }, [tasks]);

  // 2. Completed Today: completed tasks with completedAt matching today
  const completedTodayTasks = useMemo(() => {
    return tasks.filter((t) => t.completed && isToday(t.completedAt));
  }, [tasks]);

  // 3. History: tasks from previous calendar days
  const historyTasks = useMemo(() => {
    return tasks.filter((t) => isPreviousDay(t.createdAt));
  }, [tasks]);

  // Group history by createdAt date (newest first, tasks within each day sorted newest first)
  const groupedHistory = useMemo(() => {
    const sorted = [...historyTasks].sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const map = new Map();
    sorted.forEach((task) => {
      const key = getLocalDateKey(task.createdAt);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(task);
    });
    return Array.from(map.entries());
  }, [historyTasks]);

  // Summary counts
  const dailyTasksTotal = useMemo(() => {
    return tasks.filter((t) => t.dailyTask || t.isDaily).length;
  }, [tasks]);

  const dailyTasksCompleted = useMemo(() => {
    return tasks.filter((t) => (t.dailyTask || t.isDaily) && t.completed).length;
  }, [tasks]);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Tasks</h2>
          <p className="text-muted mb-0">Manage and track your daily development tasks.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="fw-bold fs-6">+</span> Add Task
        </button>
      </div>

      {/* Summary Cards */}
      <TaskSummaryCards
        activeCount={activeTasks.length}
        completedTodayCount={completedTodayTasks.length}
        dailyTasksTotal={dailyTasksTotal}
        dailyTasksCompleted={dailyTasksCompleted}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchTasks}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Tasks Card with Views */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {/* Full-width Tab Navigation (Equal 4:4:4 Grid Columns) */}
          <div className="row g-2 mb-4 pb-2 border-bottom">
            <div className="col-4">
              <button
                type="button"
                className={`btn w-100 py-2 ${
                  currentView === "active" ? "btn-primary shadow-sm" : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentView("active")}
              >
                Active ({activeTasks.length})
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className={`btn w-100 py-2 ${
                  currentView === "completed_today" ? "btn-primary shadow-sm" : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentView("completed_today")}
              >
                Completed Today ({completedTodayTasks.length})
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className={`btn w-100 py-2 ${
                  currentView === "history" ? "btn-primary shadow-sm" : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentView("history")}
              >
                History ({historyTasks.length})
              </button>
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Loading tasks...
            </div>
          ) : currentView === "active" ? (
            activeTasks.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="mb-2">No active tasks created today. You're all caught up! 🎉</p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create a New Task
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {activeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    isProcessing={processingId === task.id}
                  />
                ))}
              </div>
            )
          ) : currentView === "completed_today" ? (
            completedTodayTasks.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="mb-0">No tasks completed today yet. Keep building!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {completedTodayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    isProcessing={processingId === task.id}
                  />
                ))}
              </div>
            )
          ) : (
            // History View (Grouped by createdAt date, newest first)
            groupedHistory.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="mb-0">No past tasks found in history.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {groupedHistory.map(([dateLabel, items]) => (
                  <div key={dateLabel}>
                    <h6 className="fw-bold text-secondary border-bottom pb-2 mb-3">
                      📅 {dateLabel}
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {items.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={handleToggleTask}
                          onDelete={handleDeleteTask}
                          isProcessing={processingId === task.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        categories={CATEGORIES}
      />
    </div>
  );
};

export default Tasks;

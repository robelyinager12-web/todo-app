import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTasks, updateTaskStatus, deleteTask } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import useDebounce from '../hooks/useDebounce';
import MainLayout from '../components/layout/MainLayout';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskTable from '../components/tasks/TaskTable';
import TaskCard from '../components/tasks/TaskCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';

const DEFAULT_FILTERS = {
  q: '',
  status: '',
  priority: '',
  category: '',
  sortBy: 'createdAt',
  order: 'desc',
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('table');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.q, 400);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks({
        q: debouncedSearch || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        category: filters.category || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        page,
        limit: 9,
      });
      setTasks(res.data.data.tasks);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.status, filters.priority, filters.category, filters.sortBy, filters.order, page]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.status, filters.priority, filters.category, filters.sortBy, filters.order]);

  async function handleToggleComplete(task) {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await updateTaskStatus(task.id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      toast.success(newStatus === 'COMPLETED' ? 'Task completed!' : 'Marked as pending');
    } catch (err) {
      toast.error('Failed to update task');
    }
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      toast.success('Task deleted');
      setTaskToDelete(null);
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <Link to="/tasks/new">
          <Button>+ New Task</Button>
        </Link>
      </div>

      <TaskFilters
        filters={filters}
        onChange={setFilters}
        categories={categories}
        view={view}
        onViewChange={setView}
      />

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <EmptyState
          message="No tasks match your filters."
          action={
            <Link to="/tasks/new">
              <Button>Create your first task</Button>
            </Link>
          }
        />
      ) : view === 'table' ? (
        <TaskTable tasks={tasks} onToggleComplete={handleToggleComplete} onDelete={setTaskToDelete} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={setTaskToDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm ${
                p === page ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete this task?"
        message={`"${taskToDelete?.title}" will be permanently deleted. This cannot be undone.`}
      />
    </MainLayout>
  );
}

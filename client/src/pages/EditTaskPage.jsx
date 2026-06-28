import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTaskById, updateTask } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import MainLayout from '../components/layout/MainLayout';
import TaskForm from '../components/tasks/TaskForm';
import Loader from '../components/common/Loader';

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTaskById(id), getCategories()])
      .then(([taskRes, categoriesRes]) => {
        setTask(taskRes.data.data.task);
        setCategories(categoriesRes.data.data.categories);
      })
      .catch(() => toast.error('Failed to load task'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data) {
    try {
      await updateTask(id, { ...data, categoryId: data.categoryId || null });
      toast.success('Task updated!');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <p className="text-center text-gray-500">Task not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Task</h1>
      <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
        <TaskForm
          defaultValues={task}
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </MainLayout>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createTask } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import MainLayout from '../components/layout/MainLayout';
import TaskForm from '../components/tasks/TaskForm';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data.categories))
      .catch(() => {});
  }, []);

  async function handleSubmit(data) {
    try {
      await createTask({ ...data, categoryId: data.categoryId || undefined });
      toast.success('Task created!');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  }

  return (
    <MainLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Task</h1>
      <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
        <TaskForm categories={categories} onSubmit={handleSubmit} submitLabel="Create Task" />
      </div>
    </MainLayout>
  );
}

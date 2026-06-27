import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTaskStats } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import MainLayout from '../components/layout/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import PieChartCard from '../components/dashboard/PieChartCard';
import BarChartCard from '../components/dashboard/BarChartCard';
import Loader from '../components/common/Loader';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [statsRes, categoriesRes] = await Promise.all([getTaskStats(), getCategories()]);
      setStats(statsRes.data.data);
      setCategories(categoriesRes.data.data.categories);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (!stats) {
    return (
      <MainLayout>
        <p className="text-center text-gray-500">Unable to load dashboard.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Tasks" value={stats.total} accent="indigo" />
        <StatCard label="Completed" value={stats.completed} accent="green" />
        <StatCard label="Pending" value={stats.pending} accent="yellow" />
        <StatCard label="High Priority" value={stats.highPriority} accent="purple" />
        <StatCard label="Overdue" value={stats.overdue} accent="red" />
      </div>

      {/* Progress bar */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-medium text-gray-700">Overall Completion</span>
          <span className="text-gray-500">{stats.completedPercentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${stats.completedPercentage}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PieChartCard stats={stats} />
        <BarChartCard categories={categories} />
      </div>
    </MainLayout>
  );
}

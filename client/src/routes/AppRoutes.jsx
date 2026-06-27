import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import TaskListPage from '../pages/TaskListPage';
import CreateTaskPage from '../pages/CreateTaskPage';
import EditTaskPage from '../pages/EditTaskPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/tasks/new" element={<CreateTaskPage />} />
        <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
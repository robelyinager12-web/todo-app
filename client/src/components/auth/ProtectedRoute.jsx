import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // While restoring the session from localStorage on first load, avoid a
  // flash-redirect to /login before we know whether the user is logged in.
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
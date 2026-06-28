import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-indigo-600">TaskFlow</span>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700">
                Log In
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-2xl text-4xl font-bold text-gray-900 sm:text-5xl">
          Organize your tasks. Stay on top of everything.
        </h1>
        <p className="mt-4 max-w-xl text-gray-500">
          Create, prioritize, and track your daily tasks with a clean dashboard, smart filters,
          and progress insights — all in one place.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to={isAuthenticated ? '/dashboard' : '/register'}>
            <Button>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
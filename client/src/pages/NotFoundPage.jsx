import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-6xl font-bold text-indigo-600">404</p>
      <h1 className="mt-2 text-xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your tasks">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          registration={register('password', { required: 'Password is required' })}
        />

        <div className="mb-4 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" {...register('rememberMe')} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isSubmitting}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

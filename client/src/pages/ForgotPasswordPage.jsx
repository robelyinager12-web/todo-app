import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../services/authService';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await forgotPassword(data);
      setSent(true);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email">
        <p className="text-sm text-gray-600">
          If an account with that email exists, we&apos;ve sent a password reset link. It will
          expire in 1 hour.
        </p>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-medium text-indigo-600 hover:underline"
        >
          Back to login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
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
        <Button type="submit" loading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}

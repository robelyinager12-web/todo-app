import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/authService';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await resetPassword({ token, password: data.password });
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Reset link is invalid or has expired.';
      toast.error(message);
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Choose a new password below">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          registration={register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
              message: 'Password must contain a letter and a number',
            },
          })}
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          registration={register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />
        <Button type="submit" loading={isSubmitting}>
          Reset Password
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

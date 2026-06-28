import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { changePassword } from '../services/userService';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  }

  return (
    <MainLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

      <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Current Password"
            type="password"
            error={errors.currentPassword?.message}
            registration={register('currentPassword', {
              required: 'Current password is required',
            })}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.newPassword?.message}
            registration={register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' },
              pattern: { value: /\d/, message: 'Must contain at least one number' },
            })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={errors.confirmNewPassword?.message}
            registration={register('confirmNewPassword', {
              required: 'Please confirm your new password',
              validate: (value) => value === watch('newPassword') || 'Passwords do not match',
            })}
          />
          <Button type="submit" loading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
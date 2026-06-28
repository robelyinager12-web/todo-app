import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, uploadAvatar } from '../services/userService';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(
  '/api',
  ''
);

export default function ProfilePage() {
  const { updateStoredUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    getProfile()
      .then((res) => {
        const user = res.data.data.user;
        setProfile(user);
        reset({ fullName: user.fullName, email: user.email, phone: user.phone || '' });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data) {
    try {
      const res = await updateProfile(data);
      const user = res.data.data.user;
      setProfile(user);
      updateStoredUser(user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadAvatar(file);
      const user = res.data.data.user;
      setProfile(user);
      updateStoredUser(user);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  const avatarUrl = profile?.profileImage ? `${API_ORIGIN}${profile.profileImage}` : null;

  return (
    <MainLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>

      <div className="max-w-lg space-y-6">
        <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              profile?.fullName?.[0]?.toUpperCase() || '?'
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
            >
              Change Avatar
            </Button>
            <p className="mt-1 text-xs text-gray-400">JPG, PNG or WEBP. Max 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-6 shadow-sm">
          <Input
            label="Full Name"
            error={errors.fullName?.message}
            registration={register('fullName', { required: 'Full name is required' })}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            registration={register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          <Input label="Phone Number" placeholder="Optional" registration={register('phone')} />
          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}

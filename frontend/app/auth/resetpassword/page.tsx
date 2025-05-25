'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_URL } from '@/server';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  console.log(email)
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    otp: '',
    password: '',
    passwordConfirm: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const {otp, password ,passwordConfirm} = form;
    if (!otp || !password || !passwordConfirm) {
      return toast.error('Please fill in all fields');
    }

    if (password !== passwordConfirm) {
      return toast.error('Passwords do not match');
    }

    if (!email) {
      return toast.error('Email is missing in URL');
    }

    try {
      setLoading(true);
      const data = {email,otp,password,passwordConfirm};

      const res = await axios.post(
        `${API_URL}/user/reset-password`,data,
        {
         withCredentials: true
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Password reset successful');
        console.log(res.data.user)
        dispatch(setAuthUser(res.data.user))
        router.push('/auth/login');
      } else {
        toast.error(res.data.message || 'Reset failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the OTP sent to <strong>{email}</strong> and choose a new password.
        </p>

        <Input
          type="text"
          name="otp"
          placeholder="OTP"
          className="mb-3"
          value={form.otp}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="password"
          placeholder="New Password"
          className="mb-3"
          value={form.password}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
          className="mb-4"
          value={form.passwordConfirm}
          onChange={handleChange}
        />

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </div>
  );
}

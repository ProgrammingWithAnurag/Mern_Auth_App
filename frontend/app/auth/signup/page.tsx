"use client";
import axios from 'axios'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from '@/server';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';

export default function SignUpPage() {

    const dispatch = useDispatch()

  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user updates inputs
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    console.log("Form submitted:", form);
    try {
      // Replace with your actual signup API endpoint
      const res = await axios.post(`${API_URL}/user/signup`,form, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        toast.success(res.data.message || "Signup successfully");
        router.push("/auth/verify");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("unexpected error ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-green-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

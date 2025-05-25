'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/server";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      // Replace with your actual API endpoint
      const response = await axios.post(
        `${API_URL}/user/forget-password`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message || "OTP sent to your email");
        router.push(`/auth/resetpassword?email=${encodeURIComponent(email)}`)
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email to receive a password reset OTP.
        </p>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );
}

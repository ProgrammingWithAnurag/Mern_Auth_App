'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios"; // If you're using axios
import { API_URL } from "@/server";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/store/authSlice";
import { RootState } from "@/store/store";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter()

  const user = useSelector((state:RootState) => state.auth.user)

  useEffect(() => {
    if(!user){
        router.replace('/auth/signup')
    }
  },[user, router])
  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    try {
      // Example API call
      // const res = await axios.post('/api/verify', { otp: code });
      const res = await axios.post(`${API_URL}/user/verify`,{otp: code},{withCredentials:true})
      if(res.data.success){
        dispatch(setAuthUser(res.data.user))
        toast.success("OTP Verified")
        router.push('/')
      }
    } catch (error) {
      toast.error("Invalid OTP or server error");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // await axios.post('/api/resend-otp');
      const res = await axios.post(`${API_URL}/user/resend-otp`,null,{withCredentials:true})
      if(res.data.success){
          toast.success("OTP resent successfully!");
          setOtp(["", "", "", "","",""]);
          setResendTimer(30);
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
      <p className="text-gray-600 mb-6 text-center max-w-sm">We've sent a 6-digit code to your email or phone.</p>

      <div className="flex gap-3 mb-6">
        {otp.map((digit, i) => (
          <Input
            key={i}
            id={`otp-${i}`}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-12 h-12 text-center text-lg font-semibold border rounded-md shadow-sm"
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full max-w-xs mb-4">
        Verify OTP
      </Button>

      <Button
        onClick={handleResend}
        variant="ghost"
        disabled={resendTimer > 0 || isResending}
        className="text-sm"
      >
        {resendTimer > 0
          ? `Resend OTP in ${resendTimer}s`
          : isResending
          ? "Resending..."
          : "Resend OTP"}
      </Button>
    </div>
  );
}

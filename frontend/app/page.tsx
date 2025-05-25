"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter()
  const user= useSelector((state:RootState) => state.auth.user)
  console.log(user?.isVerified)
   const logoutHandler = async() => {
    const res = await axios.post(`${API_URL}/user/logout`);
    dispatch(setAuthUser(null))
    router.push('/auth/login')
    toast.success(res.data.message)
   }
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600 tracking-tight">
          Authentication App
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          
          {!user && (<Link href="/auth/signup" >
            <Button variant="ghost">
              Register
            </Button>
          </Link>)}
          {user && (
            <div className="flex items-center space-x-2">
              <Avatar className="cursor-pointer ">
                <AvatarFallback  className="font-bold uppercase">{user.username.split("")[0]}</AvatarFallback>
              </Avatar>
              <Button>Dashboard</Button>
              <Button variant={"ghost"} size={"sm"}>{user.isVerified ? "Verified" : "Not Verified"}</Button>
            </div>
          )}
          {user && (<Link href="/auth/logout">
            <Button onClick={logoutHandler} variant="outline">
              Logout
            </Button>
          </Link>)}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          Welcome to Authentication App
        </h1>
        <p className="text-gray-600 max-w-xl mb-6">
          Authentication App with OTP and Email functionality.
        </p>
        <Button>
          Go to Dashboard
        </Button>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Loader2, Lock, Mail, LogIn, Github, Chrome } from "lucide-react"; // Added Icons
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/Hooks/utils/redux";
import { logInThunk } from "@/Hooks/Redux/Slice/authSlice";

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { loading } = useAppSelector((state) => state.auth);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res: any = await dispatch(logInThunk(form));

        if (res.meta.requestStatus === "fulfilled") {
            router.push("/dashboard");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 overflow-hidden font-sans">

            {/* Background Orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>

            <form
                onSubmit={handleSubmit}
                className="relative backdrop-blur-2xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-[420px] space-y-6"
            >
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-2 border border-white/20 shadow-inner">
                        <Lock className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-white/60 text-sm">Sign in to your dashboard</p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full bg-white/10 border border-white/10 p-3.5 pl-10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full bg-white/10 border border-white/10 p-3.5 pl-10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs text-white/70 hover:text-white hover:underline transition-all"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-indigo-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-95 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            <LogIn size={18} />
                            Login
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-white/20"></div>
                    <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Or continue with</span>
                    <div className="h-[1px] flex-1 bg-white/20"></div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-white hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <Chrome size={18} />
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-white hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <Github size={18} />
                        GitHub
                    </button>
                </div>

                <div className="pt-2 text-center">
                    <p className="text-white/60 text-sm">
                        New here?{" "}
                        <Link href="/register" className="font-bold text-white hover:underline transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
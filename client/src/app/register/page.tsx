"use client";

import { useState } from "react";
import { Loader2, Upload, UserPlus } from "lucide-react";
import Link from "next/link"; // Import Link for navigation
import { useAppDispatch, useAppSelector } from "@/Hooks/utils/redux";
import { signUpThunk } from "@/Hooks/Redux/Slice/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("password", form.password);
  formData.append("about", form.about);

  if (image) {
    formData.append("profileImage", image);
  }

  try {
    await dispatch(signUpThunk(formData)).unwrap();

    // redirect after successful signup
    router.push("/login");

  } catch (error) {
    console.error("Signup failed", error);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Decorative Orbs for Glass Effect Depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 w-full max-w-[420px] space-y-5"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-white/70 text-sm">Join our community today</p>
        </div>

        {/* IMAGE UPLOAD PREVIEW */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center overflow-hidden bg-white/10 group-hover:border-white transition-colors">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <Upload className="text-white/50 group-hover:text-white" size={24} />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white text-purple-600 p-1.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Upload size={14} />
              <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            onChange={handleChange}
            required
          />

          <textarea
            name="about"
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all resize-none"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transform active:scale-[0.98] transition-all shadow-xl disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              <UserPlus size={18} />
              Sign Up
            </>
          )}
        </button>

        <p className="text-center text-white/80 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-white hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

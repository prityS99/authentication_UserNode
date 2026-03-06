"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";
import UserCard from "@/compo/UserCard";

interface User {
  _id: string;
  name: string;
  email: string;
  about: string;
  profileImage?: {
    url: string;
    profileImageId: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");


//   const token = localStorage.getItem("token");
// useEffect(() => {
//   // const token = localStorage.getItem("token");
//   if (!token) {
//     toast.error("Please login to access dashboard");
//     router.push("/login");
//   }
// }, [token, router]);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:3002/app/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        setFetchError(result.message || "Failed to fetch users");
        toast.error("Failed to load users");
      }
    } catch (error) {
      setFetchError("Network error");
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-indigo-200/50 mb-6">
            <Users className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              User Directory
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover and connect with registered users
          </p>
        </div>

        {/* Error State */}
        {fetchError && (
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-red-800 font-semibold mb-2">{fetchError}</p>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user._id}
                id={user._id} 
                name={user.name}
                email={user.email}
                about={user.about}
                profileImage={user.profileImage?.url}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">Start by registering new users</p>
              <button
                onClick={fetchUsers}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-16">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Refresh Users"}
          </button>
        </div>
      </div>
    </div>
  );
}


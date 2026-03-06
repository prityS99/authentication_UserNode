"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type BlogType = {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
};

export default function Blog() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoggedUserId(userId);
  }, [router]);

  const isAuthor = loggedUserId === id;

  useEffect(() => {
    if (!id) return;

    const fetchUserBlogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:3002/app/v1/posts/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (result.success) {
          setBlogs(result.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [id]);

  const handleDelete = async (postId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3002/app/v1/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setBlogs((prev) => prev.filter((blog) => blog._id !== postId));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-indigo-600 mb-8 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Directory
        </Link>

        {blogs.length > 0 ? (
          <div className="grid gap-6">

            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white p-6 rounded-2xl shadow-sm border"
              >

                {blog.coverImage && (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={800}
                    height={400}
                    className="rounded-xl mb-4 object-cover w-full h-[250px]"
                  />
                )}

                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>

                <p className="text-gray-600 mb-4">{blog.content}</p>

                {isAuthor && (
                  <div className="flex gap-3">

                    <Link
                      href={`/edit-blog/${blog._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>
                )}

              </div>
            ))}

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center border border-dashed border-gray-300">

            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-indigo-600 w-10 h-10" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Stories Yet
            </h2>

            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              This user hasn't shared any blog posts yet.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Explore Other Users
            </Link>

          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, LogOut, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/Hooks/utils/redux";
import { logoutThunk } from "@/Hooks/Redux/Slice/authSlice";

interface UserProps {
  id: string;
  name: string;
  email: string;
  about: string;
  profileImage?: string;
}

export default function UserCard({
  id,
  name,
  email,
  about,
  profileImage,
}: UserProps) {
  const [imgError, setImgError] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login");
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    const firstInitial = names[0]?.[0]?.toUpperCase() || "U";
    const secondInitial = names[1]?.[0]?.toUpperCase() || firstInitial;
    return `${firstInitial}${secondInitial}`;
  };

  const initials = getInitials(name);
  const hasImage = profileImage && profileImage.trim() !== "" && !imgError;

  return (
    <div className="group relative w-80 flex flex-col justify-between p-6 rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      
      {/* Decorative background glow inside the card */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />

      <div>
        {/* Profile Image Section */}
        <div className="relative mx-auto mb-6 flex justify-center">
          <div className="relative z-10 p-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg group-hover:rotate-3 transition-transform duration-500">
            {hasImage ? (
              <Image
                src={profileImage}
                alt={name}
                width={100}
                height={100}
                className="w-24 h-24 rounded-xl object-cover border-2 border-white/50"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-24 h-24 rounded-xl flex items-center justify-center text-2xl font-black bg-slate-900 text-white border-2 border-white/50">
                {initials}
              </div>
            )}
          </div>
          {/* Subtle ring animation behind photo */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-xl bg-indigo-400/20 blur-xl group-hover:scale-125 transition-transform duration-700" />
        </div>

        {/* Text Content */}
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">
            {name}
          </h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-xs font-semibold">
            <Mail size={12} />
            {email}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 px-2 pt-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
            “{about}”
          </p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="mt-8 space-y-3 relative z-10">
        <Link
          href={`/blog/${id}`}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-600 hover:shadow-indigo-200 transition-all duration-300 active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>Read Stories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-gray-400 font-medium hover:text-red-500 hover:bg-red-50/50 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs tracking-wide">Sign Out</span>
        </button>
      </div>

      {/* Shine Effect Overlay */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shine" />
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { BookOpen, ArrowRight } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAppDispatch } from "@/Hooks/utils/redux";
// import { logoutThunk } from "@/Hooks/Redux/Slice/authSlice";

// interface UserProps {
//   id: string;
//   name: string;
//   email: string;
//   about: string;
//   profileImage?: string;
// }



// export default function UserCard({
//   id,
//   name,
//   email,
//   about,
//   profileImage,
// }: UserProps) {

//   const [imgError, setImgError] = useState(false);


//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const handleLogout = async () => {
//     await dispatch(logoutThunk());
//     router.push("/login");
//   };

//   const getInitials = (fullName: string) => {
//     const names = fullName.trim().split(" ");
//     const firstInitial = names[0]?.[0]?.toUpperCase() || "U";
//     const secondInitial = names[1]?.[0]?.toUpperCase() || firstInitial;
//     return `${firstInitial}${secondInitial}`;
//   };

//   const initials = getInitials(name);
//   const hasImage = profileImage && profileImage.trim() !== "" && !imgError;

//   return (
//     <div className="group relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 w-80 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border border-white/50 hover:border-indigo-200/50 flex flex-col justify-between">

//       <div>
//         <div className="mx-auto mb-6 flex justify-center">

//           {hasImage ? (
//             <Image
//               src={profileImage}
//               alt={name}
//               width={112}
//               height={112}
//               className="w-24 h-24 rounded-2xl object-cover shadow-lg"
//               onError={() => setImgError(true)}
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-white/50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
//               {initials}
//             </div>
//           )}

//         </div>

//         <div className="space-y-2 text-center">
//           <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
//             {name}
//           </h2>

//           <p className="text-indigo-600 font-medium text-sm truncate">
//             {email}
//           </p>

//           <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 italic">
//             "{about}"
//           </p>
//         </div>
//       </div>

//       <div className="mt-6">
//         <Link
//           href={`/blog/${id}`}
//           className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 active:scale-95"
//         >
//           <BookOpen className="w-4 h-4" />
//           <span>View Blog</span>
//           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//         </Link>

//         <button
//           onClick={handleLogout}
//           className="mt-3 w-full py-2 px-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300 active:scale-95"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
//     </div>
//   );
// }


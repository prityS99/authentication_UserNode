"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3002/app/v1/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            dispatch(
              setUser({
                ...data.data,
                token,
                isAuthenticated: true,
              })
            );
          }
        });
    }
  }, []);

  return null;
}
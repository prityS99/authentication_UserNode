import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface userState {
  user: any;
  token: string | undefined;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: "admin" | "user" | null;
}

const initialState: userState = {
  user: null,
  token: "",
  loading: false,
  error: null,
  isAuthenticated: false,
  role: null,
};


// async function fetchUserRole(userId: string): Promise<"admin" | "user"> {
//   const { data, error } = await api
//     .from("profiles")
//     .select("role")
//     .eq("id", userId)
//     .single();

//   if (error || !data?.role) return "user";
//   return data.role;
// }

// --- SIGNUP Thunk ---
export const signUpThunk = createAsyncThunk(
  "auth/signup",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await api.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Signup successful 🎉");

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);
// --- LOGIN Thunk ---
export const logInThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/login", { email, password });

      const token = res.data.token;

      sessionStorage.setItem("token", token);

      toast.success("Welcome back 👋");

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
// --- LOGOUT Thunk ---
export const logoutThunk = createAsyncThunk(
  "auth/signout",
  async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    toast.info("Logged out 👋");

    return null;
  }
);

// --- GET SESSION Thunk ---
export const getCurrentSession = createAsyncThunk(
  "auth/getSession",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/dashboard");

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // SIGNUP
      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.loading = false;

        // backend may return user
        state.user = action.payload.user || null;

        toast.success("Signup successful 🎉");
      })

      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        toast.error(state.error || "Signup failed ❌");
      })


      // LOGIN
      .addCase(logInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logInThunk.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token;
        const user = action.payload.user;

        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful 👋");
      })

      .addCase(logInThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        toast.error(state.error || "Login failed ❌");
      })


      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = "";
        state.isAuthenticated = false;

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.info("Logged out 👋");
      })

      .addCase(logoutThunk.rejected, (state, action) => {
        state.error = action.payload as string;

        toast.error("Logout failed ❌");
      })


      // SESSION RESTORE
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      });
  },
});


export const { clearError } = AuthSlice.actions;
export default AuthSlice.reducer;

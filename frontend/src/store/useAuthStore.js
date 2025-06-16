import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useWallpaperStore } from "./useWallpaperStore";

const BASE_URL = "https://flary.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  initializeWallpaper: async () => {
    const { authUser } = get();
    if (authUser) {
      try {
        await useWallpaperStore.getState().initializeFromAuthUser();
      } catch (error) {
        console.error("Error initializing wallpaper:", error);
      }
    } else {
      useWallpaperStore.getState().reset();
    }
  },


// Update the checkAuth function
checkAuth: async () => {
  set({ isCheckingAuth: true });
  try {
    const res = await axiosInstance.get("/auth/check");
    if (res.data) {
      set({ authUser: res.data });
      get().connectSocket();
      // Ensure token is in localStorage for mobile
      const token = localStorage.getItem("authToken");
      if (!token && res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
    } else {
      set({ authUser: null });
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.log("Auth check failed", error);
    // For mobile, try with token from localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const verifyRes = await axiosInstance.get("/auth/check", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (verifyRes.data) {
          set({ authUser: verifyRes.data });
          get().connectSocket();
          return;
        }
      } catch (e) {
        console.log("Token verification failed", e);
      }
    }
    set({ authUser: null });
    localStorage.removeItem("authToken");
  } finally {
    set({ isCheckingAuth: false });
  }
},

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
      await get().initializeWallpaper();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

 login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    
    // If on mobile, store token in localStorage
    if (res.data.token) {
      localStorage.setItem("authToken", res.data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }

    set({ authUser: res.data.user });
  } catch (error) {
    toast.error("Login failed");
  } finally {
    set({ isLoggingIn: false });
  }
},

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, onlineUsers: [] });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      useWallpaperStore.getState().reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateWallpaperSettings: async (data) => {
    try {
      const res = await axiosInstance.put("/wallpaper", data);
      
      
      set((state) => ({
        authUser: {
          ...state.authUser,
          wallpaperSettings: res.data.wallpaperSettings
        }
      }));
      
      
      return res.data.wallpaperSettings;
    } catch (error) {
      console.error("Failed to update wallpaper settings:", error);
      
      
      const { authUser } = get();
      if (authUser?.wallpaperSettings) {
        useWallpaperStore.getState().initializeFromAuthUser();
      }
      
      throw error; 
    }
  },


  deleteWallpaper: async (wallpaperId) => {
  try {
    const res = await axiosInstance.delete(`/wallpaper/${wallpaperId}`);
    
    set((state) => ({
      authUser: {
        ...state.authUser,
        wallpaperSettings: res.data.wallpaperSettings
      }
    }));
    
    return res.data.wallpaperSettings;
  } catch (error) {
    console.error("Failed to delete wallpaper:", error);
    throw error; 
  }
},

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      await get().initializeWallpaper();
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      console.log("Error in update profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

connectSocket: () => {
  const { authUser } = get();
  if (!authUser || get().socket?.connected) return;

  const socket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
    transports: ["websocket", "polling"], // Important for mobile
    upgrade: true,
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err);
    // Try reconnecting after delay
    setTimeout(() => get().connectSocket(), 2000);
  });

  socket.connect();

  set({ socket });

  socket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

socket.on("userStatusUpdate", (updatedUser) => {
  set((state) => {
   
    if (state.authUser?._id === updatedUser._id) {
      return { 
        authUser: {
          ...state.authUser,
          lastOnline: updatedUser.lastOnline
        }
      };
    }
    return state;
  });
  
  
});
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
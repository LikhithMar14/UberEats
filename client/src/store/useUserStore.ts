import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:8000/api/v1/auth";
axios.defaults.withCredentials = true;

interface User {
  fullname: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  verifyEmail: (verificationToken: string) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface Response {
  success: boolean;
  message: string;
  user?: User,
}


export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  loading: false,

  signup: async (input: SignupInputState) => {
    try {
      set({ loading: true });
      const response = await axios.post<Response>(
        `${API_END_POINT}/signup`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({ loading: false });
        toast.success(response.data.message)
      }
    } catch (error: any) {
      console.log("Signup error:", error);
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Signup Failed");
      throw error;
    }
  },

  verifyEmail: async (verificationCode: string) => {
    try {
      set({ loading: true });
      const response = await axios.post<Response>(
        `${API_END_POINT}/verify-email`,
        { verificationCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        // Ensure response.data.data is defined and contains user
          set({
            loading: false,
            user: response.data.user,
            isAuthenticated: true,
          });
         
          toast.success("Verification Successful");
          
        
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      set({ loading: false });

      toast.error(error?.response?.data?.message || "Verification failed");
      throw error;
    }
  },
  

  login: async (input: LoginInputState) => {
    try {
      set({ loading: true });
      const response = await axios.post<Response>(
        `${API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({
          loading: false,
          user: response.data.user, 
          isAuthenticated: true,
        });
        toast.success(response.data.message);
      }
    } catch (err: any) {
      set({ loading: false });
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post<Response>(
        `${API_END_POINT}/logout`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        set({ user: null, isAuthenticated: false });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Logout failed");
      throw err;
    }
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
  
      const response = await axios.get<{ success: boolean; user: any }>(`${API_END_POINT}/check-auth`);
      
      if (response.data.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      }
    } catch (err) {
      console.error(err);
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  }
  

  
   
}));

import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/v1/auth";
axios.defaults.withCredentials = true;

interface User {
  fullname: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country:string;
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
  generateSession: () => Promise<void>;
  forgotPassword: (email:string) => Promise<void>;
  resetPassword : (token: string, newPassword: string) => Promise<void>;
  updateProfile: (formData:FormData) => Promise<void>
}

interface Response {
  success: boolean;
  message: string;
  user?: User,
}


export const useUserStore = create<UserState>()(persist((set) => ({
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
        set({ loading: false ,user:response.data.user});
    
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
        set({
          loading:false,
          isAuthenticated:false
        })
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      set({ loading: false ,isAuthenticated:false
      });

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
        console.log(response.data)
        set({
          loading: false,
          user: response.data.user, 
          isAuthenticated: true,
        });
        console.log("Hello")
        console.log(response.data.user)
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
  },
  generateSession : async() => {
    try {
      const response = await axios.get(`${API_END_POINT}/generate-session`, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        console.log('Session generated successfully:', response.data);
      } else {
        throw new Error('Failed to generate session');
      }
    } catch (error) {
      console.error('Error generating session:', error);
      throw error;
    }
  },
  forgotPassword: async (email: string) => {
    try {
        set({ loading: true });
        const response = await axios.post<Response>(`${API_END_POINT}/forgot-password`, { email });
        console.log(response.data);
        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        toast.error(error.response.data.message);
    } finally {
        set({ loading: false }); 
    }
},

resetPassword: async (token: string, newPassword: string) => {
    try {
        set({ loading: true });
        const response = await axios.post<Response>(`${API_END_POINT}/reset-password/${token}`, { newPassword });
        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message); 
        }
    } catch (error: any) {
        toast.error(error.response.data.message);
    } finally {
        set({ loading: false });
    }
},

updateProfile: async (formData) => {
  set({ loading: true }); // Set loading to true when the request starts
  // console.log("input:", formData.profilePicture);

  try {

    const response = await axios.put<Response>(`${API_END_POINT}/profile/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    if (response.data.success) {
      toast.success(response.data.message);
      set({ user: response.data.user,  isAuthenticated: true });
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Profile update failed");
  } finally {
    set({ loading: false });
  }
}
}),

{
  name: 'user-name',
  storage: createJSONStorage(() => localStorage),
}
))

'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import authSvc from "../services/auth.service";

export interface IAuthContext {
  loggedInUser: null | ILoggedInUserProfile;
  setLoggedInUserProfile: React.Dispatch<
    React.SetStateAction<ILoggedInUserProfile | null>
  >;
  loading: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
};

export interface ILoggedInUserProfile {
  address: string;
  createdAt: Date | string;
  email: string;
  image: {
    optimizedUrl: string;
    publicId: string;
    secureUrl: string;
  };
  name: string;
  phone: string;
  role: string;
  status: string;
  _id: string;
}

export const AuthContext = createContext<IAuthContext>({
  loggedInUser: null,
  setLoggedInUserProfile: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUser, setLoggedInUserProfile] =
    useState<ILoggedInUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await authSvc.getRequest("/auth/me");
        
        
        setLoggedInUserProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        setLoggedInUserProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
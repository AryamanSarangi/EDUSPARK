import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast"; // <-- added
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  const { toast } = useToast(); // <-- added

  // Register User
  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        toast({
          title: "🎉 Registration Successful",
          description: "Your account has been created. Please login.",
        });
      } else {
        toast({
          title: "❌ Registration Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      toast({
        title: "Error",
        description: "Could not register. Try again later.",
        variant: "destructive",
      });
    }
  }

  // Login User
  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem("accessToken", data.data.accessToken);
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast({
          title: "👋 Welcome Back",
          description: `Logged in as ${data.data.user.userName}`,
        });
      } else {
        setAuth({ authenticate: false, user: null });
        toast({
          title: "❌ Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setAuth({ authenticate: false, user: null });
      toast({
        title: "Error",
        description: "Could not login. Try again later.",
        variant: "destructive",
      });
    }
  }

  // Check Auth User
  async function checkAuthUser() {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setAuth({ authenticate: false, user: null });
        return; // skip calling protected endpoint without token
      }
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (error) {
      console.error(error);
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

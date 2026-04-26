import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchProfile,
  loginWithGoogle,
  logoutUser,
  requestPhoneOtp,
  verifyPhoneOtp as confirmOtpRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hari_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("hari_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        setUser(profile);
        localStorage.setItem("hari_user", JSON.stringify(profile));
      } catch (_error) {
        localStorage.removeItem("hari_token");
        localStorage.removeItem("hari_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const syncAuthResult = (result) => {
    setUser(result.user);
    localStorage.setItem("hari_user", JSON.stringify(result.user));
    toast.success("Logged in successfully");
  };

  const loginGoogle = async () => {
    const result = await loginWithGoogle();
    syncAuthResult(result);
  };

  const sendOtp = async (phoneNumber) => requestPhoneOtp(phoneNumber, "recaptcha-container");

  const confirmOtp = async (confirmationResult, otp) => {
    const result = await confirmOtpRequest(confirmationResult, otp);
    syncAuthResult(result);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginGoogle,
        sendOtp,
        confirmOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

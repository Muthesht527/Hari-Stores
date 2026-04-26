import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const formatIndianPhoneNumber = (value) => {
  const cleaned = value.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    const normalized = `+${cleaned.slice(1).replace(/\D/g, "")}`;
    return normalized;
  }

  const digitsOnly = cleaned.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return `+${digitsOnly}`;
  }

  return digitsOnly ? `+${digitsOnly}` : "";
};

const isValidIndianPhoneNumber = (value) => /^\+91\d{10}$/.test(value);

export default function LoginPage() {
  const { user, loginGoogle, sendOtp, confirmOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginGoogle();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtp = async () => {
    const formattedPhoneNumber = formatIndianPhoneNumber(phoneNumber);

    if (!isValidIndianPhoneNumber(formattedPhoneNumber)) {
      toast.error("Enter a valid Indian mobile number like +919876543210");
      return;
    }

    try {
      setLoading(true);
      const result = await sendOtp(formattedPhoneNumber);
      setConfirmationResult(result);
      setPhoneNumber(formattedPhoneNumber);
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error(error.message || "Failed to send OTP. Check the phone format and Firebase setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await confirmOtp(confirmationResult, otp);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="bg-gradient-to-br from-brand-700 via-brand-500 to-amber-300 p-10 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Hari Enterprises</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Secure sign in for shoppers and admins.</h1>
        <p className="mt-4 text-sm text-amber-50">
          Use Google or phone OTP with Firebase Authentication and continue shopping with your
          verified account.
        </p>
      </div>

      <div className="space-y-6 p-8 sm:p-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Choose the login method that works best for you.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">Phone OTP</h3>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="9876543210 or +919876543210"
            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <p className="mt-2 text-xs text-slate-500">
            We accept `9876543210`, `919876543210`, or `+919876543210` and normalize it
            automatically.
          </p>
          <div id="recaptcha-container" className="mt-4" />
          {!confirmationResult ? (
            <button
              onClick={handlePhoneOtp}
              disabled={loading || !phoneNumber}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
            >
              Send OTP
            </button>
          ) : (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

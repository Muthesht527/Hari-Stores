import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import api from "./api";

let recaptchaVerifier;

const exchangeFirebaseToken = async (firebaseUser) => {
  const idToken = await firebaseUser.getIdToken();
  const { data } = await api.post("/auth/firebase", { idToken });
  localStorage.setItem("hari_token", data.token);
  localStorage.setItem("hari_user", JSON.stringify(data.user));
  return data;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return exchangeFirebaseToken(result.user);
};

export const setupRecaptcha = (containerId) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "normal",
    });
  }

  return recaptchaVerifier;
};

export const requestPhoneOtp = async (phoneNumber, containerId) => {
  const verifier = setupRecaptcha(containerId);
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
};

export const verifyPhoneOtp = async (confirmationResult, otp) => {
  const result = await confirmationResult.confirm(otp);
  return exchangeFirebaseToken(result.user);
};

export const fetchProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

export const logoutUser = async () => {
  localStorage.removeItem("hari_token");
  localStorage.removeItem("hari_user");
  await signOut(auth);
};

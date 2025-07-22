"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { message, Modal } from "antd";
import { useState } from "react";
import { login, otp1, otp2 } from "@/api/userApi";
import loginStore from "@/store/page";

const Login = observer(() => {
  const router = useRouter();

  const [resetVisible, setResetVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const store = loginStore;
  const [messageApi, contextHolder] = message.useMessage();

  const [forms, setForms] = useState({
    email: "",
    password: "",
  });

  const handleSignUpPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await login(forms);
      handleRoleChange(response.user.status);
      router.push("/maindashboard");
      messageApi.success("Login successful!");
      if (typeof window !== "undefined") {
        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        localStorage.setItem("user", response.user.id);
        
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        (error &&
          typeof error === "object" &&
          "response" in error &&
          (error as { response?: { data?: { detail?: string } } }).response
            ?.data?.detail) ||
        "Login failed. Please try again.";
      messageApi.error(errorMessage as string);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (status: string) => {
    const role = status.toLowerCase() === "seller" ? "Seller" : "Buyer";
    store.setRole(role as "Seller" | "Buyer");
  };

  const handleSignupNavigation = () => {
    setSignupLoading(true);
    setTimeout(() => {
      router.push("/signup");
    }, 800);
  };

  const handleSendOtp = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      await otp1(email);
      message.success("OTP sent to your email!");
      setStep("otp");
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      const errorMessage =
        err.response?.data?.detail || "Failed to send OTP. Please try again.";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim()) return;

    setLoading(true);
    try {
      await otp2(email, otp, password);
      message.success("OTP verified successfully!");
      setResetVisible(false);
      setEmail("");
      setPassword("");
      setOtp("");
      setStep("email");
      router.push("/maindashboard");
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage =
        err.response?.data?.error ||
        "OTP verification failed. Please try again.";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 overflow-hidden">
      {contextHolder}
      {signupLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Redirecting to Sign Up...
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we prepare the registration form
            </p>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <span className="mr-1">📝</span>
              Loading registration form...
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob top-0 left-0" />
        <div className="absolute w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 top-20 right-0" />
        <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 bottom-0 left-1/2" />
      </div>
      <div className="relative w-full max-w-md px-8 py-10 bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2rem] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] scale-100 hover:scale-[1.02]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Sign In
          </CardTitle>
          <p className="text-sm text-gray-600">
            Access your dashboard securely
          </p>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          <form className="space-y-4" onSubmit={handleSignUpPage}>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={forms.email}
                onChange={(e) => setForms({ ...forms, email: e.target.value })}
                className="bg-white/70 backdrop-blur border border-gray-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={forms.password}
                onChange={(e) =>
                  setForms({ ...forms, password: e.target.value })
                }
                className="bg-white/70 backdrop-blur border border-gray-300"
              />
            </div>
            <Button
              type="submit"
              className=" cursor-pointer w-full mt-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Forgot password?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setResetVisible(true)}
            > Reset it
            </span>
          </p>
          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              onClick={handleSignupNavigation}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </CardContent>
      </div>
      <Modal
        open={resetVisible}
        onCancel={() => {
          setResetVisible(false);
          setEmail("");
          setOtp("");
          setStep("email");
        }}
        footer={null}
        centered
      >
        <div className="space-y-4 p-4">
          <h2 className="text-xl font-semibold text-center text-blue-600">
            🔐 Reset Password
          </h2>
          {step === "email" && (
            <>
              <label
                htmlFor="reset-email"
                className="block text-sm text-gray-700"
              >
                Enter your email
              </label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={!email.trim() || loading}
                loading={loading}
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            </>
          )}
          {step === "otp" && (
            <>
              <label htmlFor="otp" className="block text-sm text-gray-700">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/70 backdrop-blur border border-gray-300"
                />
              </div>
              <Button
                className="w-full bg-green-500 text-white hover:bg-green-600 mt-2"
                disabled={!otp.trim() || loading}
                loading={loading}
                onClick={handleOtpSubmit}
              >
                Save & Login
              </Button>
            </>
          )}
        </div>
      </Modal>
    </main>
  );
});

export default Login;

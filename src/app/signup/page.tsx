"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { registerUser, registerUserOtp } from "@/api/userApi";
import loginStore from "../../store/page";

export default function SignUp() {
  const router = useRouter();
  const store = loginStore;

  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempResponse, setTempResponse] = useState<any>(null);
  const [forms, setForms] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    state: "",
    country: "",
    status: "",
    phone_number: "",
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleLoginNavigation = () => {
    setLoginLoading(true);
    // Add delay for better UX
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(forms);
      setTempResponse(response);
      setOtpModal(true);
      messageApi.success(
        "Signup successful! Please verify your email with the OTP sent.",
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || "Signup failed. Please try again.";
      messageApi.error(errorMessage);
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await registerUserOtp({
        email: forms.email,
        otp: otp,
      });
      store.islogin = true;
      store.setRole(forms.status === "seller" ? "Seller" : "Buyer");
      if (typeof window !== "undefined") {
        localStorage.setItem("access", tempResponse.access);
        localStorage.setItem("refresh", tempResponse.refresh);
      }

      setOtpModal(false);
      messageApi.success("OTP verified successfully!");
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        "OTP verification failed. Please try again.";
      messageApi.error(errorMessage);
      setOtp("");
      setOtpModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 overflow-hidden">
      {contextHolder}
      
      {/* Login Loading Overlay */}
      {loginLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Redirecting to Login...
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we take you to the login page
            </p>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <span className="mr-1">🔐</span>
              Loading login form...
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob top-0 left-0"></div>
        <div className="absolute w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 top-20 right-0"></div>
        <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 bottom-0 left-1/2"></div>
      </div>
      <div className="relative w-full max-w-md px-8 py-10 bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2rem] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] scale-100 hover:scale-[1.02]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800 ">
            Sign Up
          </CardTitle>
          <p className="text-sm text-gray-600">Create your account</p>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <form className="space-y-4" onSubmit={handleSignup}>
            {[
              { id: "username", label: "Username", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "password", label: "Password", type: "password" },
              { id: "city", label: "City", type: "text" },
              { id: "state", label: "State", type: "text" },
              { id: "country", label: "Country", type: "text" },
              { id: "phone_number", label: "Phone Number", type: "number" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  {label}
                </label>
                <Input
                  id={id}
                  type={type}
                  value={(forms as any)[id]}
                  onChange={(e) => setForms({ ...forms, [id]: e.target.value })}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="bg-white/70 backdrop-blur border border-gray-300"
                />
              </div>
            ))}

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Your Account Type:
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="radio"
                    id="buyer"
                    name="role"
                    value="buyer"
                    onChange={(e) =>
                      setForms({ ...forms, status: e.target.value })
                    }
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="buyer"
                    className="flex flex-col items-center p-4 bg-white/50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-white/70 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200"
                  >
                    <span className="text-2xl mb-2">🛒</span>
                    <span className="text-sm font-medium text-gray-700">
                      Buyer
                    </span>
                    <span className="text-xs text-gray-500 text-center mt-1">
                      Purchase products
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="radio"
                    id="seller"
                    name="role"
                    value="seller"
                    onChange={(e) =>
                      setForms({ ...forms, status: e.target.value })
                    }
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="seller"
                    className="flex flex-col items-center p-4 bg-white/50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-white/70 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-200"
                  >
                    <span className="text-2xl mb-2">🏪</span>
                    <span className="text-sm font-medium text-gray-700">
                      Seller
                    </span>
                    <span className="text-xs text-gray-500 text-center mt-1">
                      Sell your products
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full cursor-pointer mt-2 bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign Up
            </Button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={handleLoginNavigation}
              className="text-green-500 hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
            >
              Log in
            </button>
          </p>
        </CardContent>
      </div>
      <Modal
        open={otpModal}
        title="Enter OTP"
        onOk={handleVerifyOtp}
        onCancel={() => setOtpModal(false)}
        okText="Verify"
        cancelText="Cancel"
      >
        <p className="mb-2 text-gray-600">
          Please enter the 6-digit OTP sent to your email.
        </p>
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Modal>
    </main>
  );
}

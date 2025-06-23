"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Seller() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleProducts = () => {
    setIsLoading(true);
    // Add delay for better UX
    setTimeout(() => {
      router.push("/product");
    }, 800);
  };
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Product Management...
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we prepare your product dashboard
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
              <span className="mr-1">🛍️</span>
              Setting up your seller tools...
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
        Welcome to the Seller Dashboard
      </h1>

      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        Manage your products, view your sales, and stay on top of your
        orders—all in one simple and powerful dashboard.
      </p>

      <button
        onClick={() => handleProducts()}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
      >
        Get Started
      </button>
    </div>
  );
}

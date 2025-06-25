"use client";
import { interactionView } from "@/api/userApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Seller() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [interactions, setInteractions] = useState([]);

  const handleProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/product");
    }, 800);
  };

  const getInteraction = async () => {
    try {
      const response = await interactionView();
      console.log(response);
      setInteractions(response || []);
    } catch (error) {
      console.error("Error fetching interaction:", error);
    }
  };

  useEffect(() => {
    getInteraction();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 relative">
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
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 mb-10"
      >
        Get Started
      </button>

      {/* 🔽 Interaction Cards Section */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {interactions.length > 0 ? (
    interactions.map((item: any) => (
      <div
        key={item.id}
        className="bg-white border border-blue-100 rounded-2xl shadow hover:shadow-lg transition duration-300 p-6 relative group"
      >
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-t-2xl" />

        <div className="mt-2">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            👤 {item.buyer.username}
          </h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
            📧 <span>{item.buyer.email}</span>
          </p>
          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
            📞 <span>{item.buyer.phone_number}</span>
          </p>

          <div className="text-sm text-gray-700 flex items-center gap-2 mb-2">
            📍
            <span>
              {item.buyer.city}, {item.buyer.state}, {item.buyer.country}
            </span>
          </div>

          {/* Number of Interactions Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full shadow">
              {item.number_of_interactions} {item.number_of_interactions === 1 ? 'Interaction' : 'Interactions'}
            </span>
          </div>

          {/* Last Interaction Timestamp */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              Last Interacted: {item.last_interacted_at ? new Date(item.last_interacted_at).toLocaleString() : 'N/A'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              Product ID: {item.product}
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
              {item.last_interacted_at ? new Date(item.last_interacted_at).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Hover Hint */}
        <div className="absolute top-2 right-2 bg-blue-50 text-blue-500 text-xs font-medium px-2 py-1 rounded shadow-sm group-hover:scale-105 transition-transform">
          New View
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center col-span-full">
      No buyer interactions yet.
    </p>
  )}
</div>

    </div>
  );
}

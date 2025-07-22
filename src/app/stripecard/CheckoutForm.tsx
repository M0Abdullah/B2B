"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaCreditCard } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CheckoutForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setMessage("");
    setTimeout(() => {
      setMessage("✅ Payment submitted! Backend will handle processing.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg animate-fade-in"
    >
      <div className="text-center">
        <FaCreditCard className="mx-auto text-blue-500 text-4xl mb-2" />
        <h2 className="text-2xl font-extrabold text-gray-800">
          Secure Payment
        </h2>
        <p className="text-gray-500 text-sm">
          You will be charged <span className="font-semibold">$29.99</span>
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          placeholder="john@example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card details
        </label>
        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": { color: "#888" },
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full flex justify-center items-center gap-2 py-3 px-6 text-white rounded-md transition-all ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isProcessing ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin" />
            Processing...
          </>
        ) : (
          "Pay $29.99"
        )}
      </button>

      {message && (
        <div className="text-center text-green-600 font-medium mt-2">
          {message}
        </div>
      )}
    </form>
  );
}

"use client";
import React, { useState } from "react";
import Navbar from "../../components/navbar/page";
import { useRouter } from "next/navigation";

const PremiumPlan = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        addModal={false}
        setAddModal={() => {}}
        premium={false}
        setPremium={() => {}}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />

      <div className="py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Premium Plan
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`cursor-pointer bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center hover:shadow-xl transition-shadow duration-300 ${
              selectedPlan === "monthly" ? "border-2 border-blue-600" : ""
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Monthly Plan
            </h2>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              $9.99<span className="text-sm font-medium">/month</span>
            </p>
            <ul className="text-left text-gray-600 mb-6 space-y-2">
              <li>✔ Access to all features</li>
              <li>✔ Priority email support</li>
              <li>✔ Cancel anytime</li>
            </ul>
            <button className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition">
              Choose Monthly
            </button>
          </div>

          <div
            onClick={() => {
              setSelectedPlan("yearly");
              router.push("/stripecard");
            }}
            className={`cursor-pointer bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center hover:shadow-xl transition-shadow duration-300 ${
              selectedPlan === "yearly" ? "border-2 border-blue-600" : ""
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Yearly Plan
            </h2>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              $99.99<span className="text-sm font-medium">/year</span>
            </p>
            <ul className="text-left text-gray-600 mb-6 space-y-2">
              <li>✔ Access to all features</li>
              <li>✔ Premium support</li>
              <li>✔ Save 17% compared to monthly</li>
            </ul>
            <button className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Choose Yearly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlan;

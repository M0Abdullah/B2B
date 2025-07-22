"use client";
import React, { useState } from "react";
import Navbar from "../../components/navbar/page";
import { useRouter } from "next/navigation";
import { message } from "antd";
const PremiumPlan = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {contextHolder}
      <Navbar
        addModal={false}
        setAddModal={() => {}}
        premium={false}
        setPremium={() => {}}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />

      <div className="py-16 px-4">
        <div className="text-center mb-16">
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  <strong className="font-bold text-2xl">Notice:</strong>
  <span className="block sm:inline text-lg ml-2">
    This is under development – Premium and Payment Gateway. Please wait...
  </span>
</div>
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Choose Your <span className="text-blue-600">Premium</span> Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock powerful features and take your business to the next level
            with our premium subscription plans
          </p>
          <div className="mt-6 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="mr-2">🔥</span>
            <span className="font-medium">
              Limited Time: 30% OFF First Month!
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`cursor-pointer bg-white rounded-3xl shadow-lg p-10 w-full max-w-md text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 relative ${
              selectedPlan === "monthly"
                ? "border-2 border-blue-600 shadow-blue-200"
                : ""
            }`}
          >
            <div className="absolute top-6 right-6 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              Flexible
            </div>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-blue-600">
                Monthly Plan
              </h2>
              <p className="text-gray-500">Perfect for getting started</p>
            </div>
            <div className="mb-8">
              <p className="text-5xl font-bold text-gray-900 mb-2">
                $9.99
                <span className="text-lg font-medium text-gray-500">
                  /month
                </span>
              </p>
              <p className="text-sm text-gray-500 line-through">$14.99</p>
            </div>
            <div className="text-left mb-8 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">
                    Advanced Analytics
                  </p>
                  <p className="text-sm text-gray-500">
                    Detailed insights and reporting
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">Priority Support</p>
                  <p className="text-sm text-gray-500">
                    24/7 email & chat support
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">Premium Features</p>
                  <p className="text-sm text-gray-500">
                    Access to all pro tools
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">Cancel Anytime</p>
                  <p className="text-sm text-gray-500">
                    No long-term commitment
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/stripecard")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Get Started Monthly
            </button>

            <p className="text-xs text-gray-400 mt-4">
              &quot;Great for testing the waters!&quot; - Sarah K.
            </p>
          </div>
          <div
            onClick={() => {
              setSelectedPlan("yearly");
            }}
            className={`cursor-pointer bg-white rounded-3xl shadow-lg p-10 w-full max-w-md text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 relative ${
              selectedPlan === "yearly"
                ? "border-2 border-blue-600 shadow-blue-200"
                : ""
            }`}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>

            <div className="absolute top-6 right-6 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              Best Value
            </div>

            <div className="mb-6 pt-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-purple-600">
                Yearly Plan
              </h2>
              <p className="text-gray-500">Best value for committed users</p>
            </div>
            <div className="mb-8">
              <p className="text-5xl font-bold text-gray-900 mb-2">
                $99.99
                <span className="text-lg font-medium text-gray-500">/year</span>
              </p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-500 line-through">$119.88</p>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">
                  Save $20
                </span>
              </div>
            </div>

            <div className="text-left mb-8 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">
                    Everything in Monthly
                  </p>
                  <p className="text-sm text-gray-500">
                    All monthly features included
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">
                    Advanced Integrations
                  </p>
                  <p className="text-sm text-gray-500">
                    Connect with 50+ tools
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">
                    Dedicated Account Manager
                  </p>
                  <p className="text-sm text-gray-500">
                    Personal support specialist
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-800">
                    Early Access Features
                  </p>
                  <p className="text-sm text-gray-500">
                    Beta features & updates
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-500 mt-1">⭐</span>
                <div>
                  <p className="font-medium text-purple-600">
                    17% Annual Savings
                  </p>
                  <p className="text-sm text-gray-500">Best price guarantee</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/stripecard")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Choose Yearly Plan
            </button>

            <p className="text-xs text-gray-400 mt-4">
              &quot;Incredible value and features!&quot; - Michael R.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg p-10 w-full max-w-md text-center text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-yellow-400">
                Enterprise
              </h2>
              <p className="text-gray-300">For large organizations</p>
            </div>

            <div className="mb-8">
              <p className="text-3xl font-bold mb-2">Custom Pricing</p>
              <p className="text-sm text-gray-400">Tailored to your needs</p>
            </div>

            <div className="text-left mb-8 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">✓</span>
                <p className="text-gray-200">Unlimited everything</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">✓</span>
                <p className="text-gray-200">White-label solution</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">✓</span>
                <p className="text-gray-200">24/7 phone support</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">✓</span>
                <p className="text-gray-200">Custom integrations</p>
              </div>
            </div>

            <button
              onClick={() => messageApi.info("This is under development")}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-4 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Contact Sales
            </button>

            <p className="text-xs text-gray-400 mt-4">
              &quot;Perfect for our enterprise needs!&quot; - Lisa T.
            </p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6">
            Trusted by 10,000+ businesses worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="w-24 h-8 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-sm font-medium">Company A</span>
            </div>
            <div className="w-24 h-8 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-sm font-medium">Company B</span>
            </div>
            <div className="w-24 h-8 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-sm font-medium">Company C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlan;

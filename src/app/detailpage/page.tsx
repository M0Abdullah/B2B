/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Suspense } from "react";
import { message } from "antd";
import Navbar from "../../components/navbar/page";
import { Star, Mail, MapPin, CheckCircle, Phone } from "lucide-react";
import { Button, Skeleton } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  productByCategory,
  reviewProduct,
  productViewById,
} from "@/api/userApi";

function ProductDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const category = searchParams.get("category");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [productDetails, setProductDetails] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;
      if (!token) {
        messageApi.error("Unauthorized! Please login.");
        router.push("/login");
        return;
      }

      if (category) {
        const response = await productByCategory(Number(category));
        if (Array.isArray(response) && response.length > 0) {
          setProductDetails(response[0]);
        } else {
          setProductDetails(null); 
        }
      } else {
        const response = await productViewById(Number(productId));
        setProductDetails(response || null);
      }
      
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error?.response?.data?.detail || "Failed to fetch product details.";
      messageApi.error(errorMessage);
      if (error?.response?.status === 401) {
        messageApi.error("Unauthorized! Please login.");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;
      if (!token) {
        messageApi.error("Unauthorized! Please login.");
        router.push("/login");
        return;
      }
      const formData = new FormData();
      formData.append("product", productId || "");
      formData.append("rating", String(review.rating));
      formData.append("comment", review.comment);

      await reviewProduct(formData);

      messageApi.success("Review submitted successfully!");
      setReview({ rating: 5, comment: "" });
      fetchProductDetails();
    } catch (error) {
      console.error("Review error:", error);
      messageApi.error("Failed to submit review.");
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const product = productDetails;
  const seller = product?.seller;

  return (
    <div className="bg-gray-100 min-h-screen">
      {contextHolder}
      <Navbar
        setPremium={setShowPremiumModal}
        premium={showPremiumModal}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        addModal={false}
        setAddModal={() => {}}
      />

      {loading ? (
        <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white shadow-xl rounded-xl p-6">
            <Skeleton.Avatar
              active
              size={128}
              shape="circle"
              className="mb-4"
            />
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: "60%" }} />
            <Skeleton.Input active style={{ width: 100, height: 30 }} />
            <Skeleton
              active
              paragraph={{ rows: 3, width: ["80%", "90%", "70%"] }}
            />
            <Skeleton
              active
              title={{ width: "50%" }}
              paragraph={{ rows: 3, width: ["100%", "100%", "90%"] }}
            />
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton.Avatar
                active
                size={128}
                shape="circle"
                className="mb-4"
              />
              <Skeleton.Button active style={{ width: 120, height: 24 }} />
              <Skeleton.Input
                active
                style={{ width: 80, height: 16, marginTop: 10 }}
              />
              <Skeleton
                paragraph={{ rows: 1 }}
                title={{ width: "40%" }}
                className="mt-4 w-full"
                active
              />
              <Skeleton
                paragraph={{ rows: 2 }}
                title={{ width: "60%" }}
                className="mt-4 w-full"
                active
              />
              <Skeleton.Button
                block
                active
                style={{ height: 40, marginTop: 20 }}
              />
            </div>
          </div>
        </div>
      ) : productDetails ? (
        <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          {product && (
            <div className="bg-white shadow-xl rounded-xl p-6">
              <img
                src={product.image || "https://via.placeholder.com/400x250"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {product.description}
              </p>
              <div className="text-2xl text-green-600 font-bold mb-4">
                ${product.price}
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Features:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features
                    ?.split(",")
                    .map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Customer Reviews:
                </h4>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-5">
                    {product.reviews.map((review: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 border rounded-lg p-4 shadow-sm"
                      >
                        {review.title && (
                          <h5 className="text-md font-semibold text-gray-800 mb-1">
                            {review.title}
                          </h5>
                        )}
                        {review.comment && (
                          <p className="text-gray-600 mb-2">{review.comment}</p>
                        )}
                        {review.rating && (
                          <div className="flex items-center text-yellow-500 text-sm">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                fill="currentColor"
                                stroke="none"
                                size={16}
                              />
                            ))}
                            <span className="ml-2 text-gray-500">
                              {review.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reviews available.</p>
                )}
              </div>
              <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Leave a Review
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={review.rating}
                      onChange={(e) =>
                        setReview((prev) => ({
                          ...prev,
                          rating: Number(e.target.value),
                        }))
                      }
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Comment
                    </label>
                    <textarea
                      rows={3}
                      value={review.comment}
                      onChange={(e) =>
                        setReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                  <Button
                    type="primary"
                    onClick={handleSubmitReview}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          )}
          {seller && (
            <div className="bg-white shadow-xl rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {seller.username}
                  </h3>
                  {seller.is_verified && (
                    <CheckCircle className="text-blue-500" />
                  )}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {seller.membership_type?.toUpperCase() || "UNKNOWN"} Seller
                </div>
                <div className="flex items-center justify-center gap-1 text-yellow-500 text-lg mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" stroke="none" />
                  ))}
                  <span className="text-gray-600 text-sm ml-2">5/5</span>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mt-6 w-full text-left">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Seller Info
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Verified: {seller.is_verified ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Advertiser: {seller.is_advertiser ? "Yes" : "No"}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 mt-6 w-full rounded-lg shadow-sm text-left">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Contact Information
                  </h4>
                  <p className="flex items-center gap-2 text-gray-700 mb-2">
                    <Mail size={16} /> {seller.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 mb-2">
                    <MapPin size={16} /> {seller.city}, {seller.state},{" "}
                    {seller.country}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 mb-2">
                    <Phone size={16} /> {seller.phone_number}
                  </p>
                </div>
                <button
                  onClick={() => {
                    let phoneNumber = seller.phone_number?.replace(/\D/g, "");

                    if (phoneNumber?.startsWith("0")) {
                      phoneNumber = "92" + phoneNumber.slice(1);
                    }

                    const whatsappUrl = `https://wa.me/${phoneNumber}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="mt-6 bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Contact Seller
                </button>
                <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-lg">⚠️</span>
                    </div>
                    <h5 className="text-base font-bold text-blue-900">
                      Contact Guidelines
                    </h5>
                  </div>
                  <div className="grid gap-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-800 font-medium">
                        Contact hours: 9 AM - 6 PM (Local Time)
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-800">
                        Please be respectful and professional
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-800">
                        Verify product details before making payment
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-800">
                        Meet in safe, public locations for transactions
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-800">
                        Report suspicious activity to our support team
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600 font-medium bg-white px-3 py-2 rounded-lg shadow-sm">
                      📋 By contacting this seller, you agree to our Terms of
                      Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-20 px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-600">
            ⚠️ No product data available.
          </h2>
          <p className="text-gray-500 mt-2">
            The product might have been removed or doesn't exist.
          </p>
          <Button
            type="primary"
            className="mt-6"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}
export default function DetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}

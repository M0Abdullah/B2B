/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Badge } from "antd";
import SearchFilter from "../searchfilter/page";
import Navbar from "../../components/navbar/page";
import Seller from "../seller/page";
import loginStore from "@/store/page";
import { Modal, message, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { CrownOutlined } from "@ant-design/icons";
import AddModal from "../addmodal";
import { productis_Trending, productView } from "@/api/userApi";

type Product = {
  image: string;
  id: string;
  name: string;
  price: string | number;
  description?: string;
  category?: string;
  seller?: {
    username?: string;
  };
  features?: string;
};

export default function MainDashboard() {
  const [data, setData] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [skeletonloading, setSkeletonLoading] = useState(false);
  const [detailPageLoading, setDetailPageLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [seller, setSeller] = useState("");
  const [material, setMaterial] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [feature, setFeature] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [includeDesc, setIncludeDesc] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [temp, setTemp] = useState<string>("");
  const [addModal, setAddModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [trending, setTrending] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFetchData() {
      setSkeletonLoading(true);
      try {
        const response = await productView();

        if (response) {
          setData(response);
          setFilteredProducts(response);
        } else {
          console.warn("response is undefined");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSkeletonLoading(false);
      } finally {
        setSkeletonLoading(false);
      }
    }

    getFetchData();
  }, [messageApi, router]);

  // Handle hydration and buyer modal
  useEffect(() => {
    const checkHydration = () => {
      if (loginStore.isHydrated) {
        setIsHydrated(true);
        if (loginStore.isBuyer) {
          setAddModal(true);
        }
      } else {
        // Check again after a short delay
        setTimeout(checkHydration, 50);
      }
    };
    checkHydration();
  }, []);

  useEffect(() => {}, []);

  const applyFilters = () => {
    if (
      !title &&
      !category &&
      !seller &&
      !material &&
      !feature &&
      !priceRange &&
      includeDesc === ""
    ) {
      messageApi.info("Please apply at least one filter.");
      return;
    }
    setLoading(true);
    setSkeletonLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSkeletonLoading(false);
    }, 2000);
    const results = data.filter((product) => {
      const rawPrice = typeof product.price === "string" ? product.price : "0";
      const price = parseFloat(rawPrice.replace(/[₹\/ ,]/g, ""));

      const matchesTitle =
        title === "" ||
        (product.name &&
          product.name.toLowerCase().includes(title.toLowerCase()));

      const matchesCategory =
        category === "" ||
        product.category
          ?.toString()
          .toLowerCase()
          .includes(category.toLowerCase());

      const matchesSeller =
        seller === "" ||
        (product.seller?.username &&
          product.seller.username.toLowerCase().includes(seller.toLowerCase()));

      const matchesMaterial =
        material === "" ||
        (product.description &&
          product.description.toLowerCase().includes(material.toLowerCase()));

      const matchesFeature =
        feature === "" ||
        (product.features &&
          product.features.toLowerCase().includes(feature.toLowerCase()));

      const matchesDesc =
        includeDesc === "no"
          ? !product.description || product.description.trim() === ""
          : true;

      const matchesPrice =
        priceRange === "" ||
        (() => {
          const match =
            typeof priceRange === "string" &&
            priceRange.match(/(\d+)\s*-\s*(\d+)/);
          if (match) {
            const min = parseFloat(match[1]);
            const max = parseFloat(match[2]);
            return price >= min && price <= max;
          }
          return true;
        })();

      return (
        matchesTitle &&
        matchesCategory &&
        matchesSeller &&
        matchesMaterial &&
        matchesFeature &&
        matchesPrice &&
        matchesDesc
      );
    });

    setFilteredProducts(results);
  };

  const resetFilters = () => {
    setTitle("");
    setCategory("");
    setSeller("");
    setMaterial("");
    setFeature("");
    setPriceRange("");
    setIncludeDesc("");
    setFilteredProducts(data);
  };

  const handleLoginFirst = (productId: string) => {
    if (loginStore.islogin) {
      setDetailPageLoading(true);
      // Add a delay for better UX and show loading
      setTimeout(() => {
        router.push(`/detailpage?productId=${productId}`);
      }, 800);
    } else {
      messageApi.info("Please login for more details!");
    }
  };

  const handlePremiumSelect = (plan: string | null) => {
    if (plan) {
      setSelectedPlan(plan);
      router.push("/premiumplan");
    }
    setShowPremiumModal(false);
  };

  useEffect(() => {
    const getTrending = async () => {
      try {
        const response = await productis_Trending();
        if(response.length > 0){
          setTrending(response);
        }else{
          messageApi.info("No trending products found!");
        }
      } catch (error: any) {
        console.error("Error fetching trending products:", error);
        const errorMessage = error.response.data.details;
        messageApi.error(errorMessage);
      }
    };

    getTrending();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {contextHolder}
      {detailPageLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Product Details...
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we fetch the product information
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
              <span className="mr-1">🔍</span>
              Preparing detailed view...
            </div>
          </div>
        </div>
      )}
      <Navbar
        setPremium={setShowPremiumModal}
        premium={showPremiumModal}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        addModal={addModal}
        setAddModal={setAddModal}
      />
      <ToastContainer position="top-center" autoClose={3000} />
      <SearchFilter />

      {!isHydrated ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      ) : loginStore.isBuyer ? (
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="w-full md:w-[300px]">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 p-4">
              Buckets
            </h2>
            <Accordion
              type="single"
              collapsible
              className="rounded border bg-white shadow"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-4 text-lg font-semibold py-3 cursor-pointer ">
                  Top Trending Categories
                </AccordionTrigger>
                <AccordionContent className="px-4 justify-between ">
                  <div className="flex flex-col gap-2 cursor-pointer">
                 
                    {trending.map((item: any, index: number) => {
                      return (
                        <li
                          key={index}
                          className="text-sm text-gray-600 hover:text-blue-500"
                          onClick={() => {
                            router.push(`/detailpage?category=${item.name}`);
                          }}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex-1">
            <div className="bg-white p-4 rounded shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Product Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="Category ID"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Input
                  placeholder="Seller Name"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                />
                <Input
                  placeholder="Material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
                <Input
                  placeholder="Feature (e.g. Hot Deal)"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                />
                <Input
                  placeholder="Price Range (e.g. 100 - 500)"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <select
                  className="border cursor-pointer rounded px-3 py-2 text-sm text-gray-700"
                  value={includeDesc}
                  onChange={(e) => setIncludeDesc(e.target.value)}
                >
                  <option className="cursor-pointer" value="">
                    Include Description?
                  </option>
                  <option className="cursor-pointer" value="yes">
                    Yes
                  </option>
                  <option className="cursor-pointer" value="no">
                    No
                  </option>
                </select>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  className="bg-blue-500 text-white cursor-pointer
                  "
                  onClick={applyFilters}
                  loading={loading}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
              {skeletonloading ? (
                <div className="text-center col-span-full text-gray-500 text-sm">
                  <Skeleton />
                </div>
              ) : Array.isArray(filteredProducts) &&
                filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="flex gap-4 p-4 items-start">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.image}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <CardContent className="p-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-500">
                          {product.name}
                        </h3>
                        <p className="text-sm text-green-600 font-semibold">
                          {product.price}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {product.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Posted by:{" "}
                          <span className="font-medium">
                            {product.seller?.username}
                          </span>
                        </p>
                        <p className="text-xs font-semibold text-orange-500">
                          {product.features}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleLoginFirst(product.id)}
                        className="mt-3 w-max px-4 py-1 cursor-pointer bg-blue-500 text-sm text-white"
                      >
                        View More
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center col-span-full text-gray-500 text-sm">
                  No products found matching your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isHydrated ? (
        <Seller />
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      )}

      <Modal
        open={showPremiumModal}
        title={
          <div className="text-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 mb-2">
              ✨ Choose Your Premium Plan
            </h2>
            <p className="text-gray-600 text-lg">
              Unlock the power of premium features
            </p>
          </div>
        }
        onCancel={() => setShowPremiumModal(false)}
        footer={[
          <div key="footer-buttons" className="flex justify-center gap-4 mt-6">
            <Button
              key="cancel"
              onClick={() => setShowPremiumModal(false)}
              className="px-8 py-2 h-auto rounded-xl border-2 border-gray-300 hover:border-gray-400 font-semibold"
            >
              Maybe Later
            </Button>
            <Button
              key="save"
              onClick={() => {
                handlePremiumSelect(temp);
                setShowPremiumModal(false);
              }}
              disabled={!temp}
              className="px-8 py-2 h-auto rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              🚀 Get Premium
            </Button>
          </div>,
        ]}
        centered
        className="rounded-2xl"
        width={700}
      >
        <div className="flex flex-col gap-6 mt-6">
          {[
            {
              name: "Silver",
              desc: "Basic boost & visibility",
              color: "#9CA3AF",
              icon: "🥈",
              features: [
                "Enhanced visibility",
                "Basic analytics",
                "Priority support",
              ],
            },
            {
              name: "Gold",
              desc: "Priority listing + promotions",
              color: "#F59E0B",
              icon: "🥇",
              features: [
                "Premium placement",
                "Advanced analytics",
                "Marketing tools",
              ],
            },
            {
              name: "Platinum",
              desc: "Top-tier exposure & support",
              color: "#2563EB",
              icon: "💎",
              features: [
                "Maximum exposure",
                "Dedicated support",
                "Custom branding",
              ],
            },
          ].map(({ name, desc, color, icon, features }) => (
            <div
              key={name}
              onClick={() => setTemp(name)}
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 border-2 transform hover:-translate-y-1 ${
                temp === name
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 ring-4 ring-blue-300 border-blue-500 scale-105"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {name} Plan
                    </h4>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                </div>
                <Badge
                  count={
                    <CrownOutlined style={{ color: color, fontSize: "24px" }} />
                  }
                  style={{ backgroundColor: "transparent" }}
                />
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="text-green-500">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {addModal && (
        <AddModal
          onAdd={() => setAddModal(true)}
          onClose={() => setAddModal(false)}
        />
      )}
    </div>
  );
}

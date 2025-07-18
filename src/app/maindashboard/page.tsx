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
import SearchFilter from "@/components/SearchFilter";
import Navbar from "../../components/navbar/page";
import Seller from "../seller/page";
import loginStore from "@/store/page";
import { Modal, message, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { CrownOutlined } from "@ant-design/icons";
import AddModal from "../addmodal";
import { interaction, productis_Trending, productView } from "@/api/userApi";

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
  const [storeState, setStoreState] = useState({
    isSeller: loginStore.isSeller,
    isBuyer: loginStore.isBuyer,
    islogin: loginStore.islogin
  });
  const [isStateChanging, setIsStateChanging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Listen to store changes and update local state
  useEffect(() => {
    const updateStoreState = () => {
      const newState = {
        isSeller: loginStore.isSeller,
        isBuyer: loginStore.isBuyer,
        islogin: loginStore.islogin
      };
      
      // Check if state has changed
      if (JSON.stringify(newState) !== JSON.stringify(storeState)) {
        setIsStateChanging(true);
        
        // Update state after 3 seconds
        setTimeout(() => {
          setStoreState(newState);
          setIsStateChanging(false);
        }, 3000);
      }
    };

    // Initial update
    updateStoreState();

    // Set up an interval to check for store changes
    const interval = setInterval(updateStoreState, 100);

    return () => clearInterval(interval);
  }, [storeState]);

  // Handle hydration and buyer modal
  useEffect(() => {
    const checkHydration = () => {
      if (loginStore.isHydrated) {
        setIsHydrated(true);
        if (storeState.isBuyer) {
          setAddModal(true);
        }
      } else {
        // Check again after a short delay
        setTimeout(checkHydration, 50);
      }
    };
    checkHydration();
  }, [storeState.isBuyer]);

  useEffect(() => {}, []);

  const applyFilters = () => {
    // Only allow filtering for buyers
    if (!storeState.isBuyer) {
      messageApi.info("Please login as a buyer to use search and filters.");
      return;
    }
    
    if (
      !title &&
      !category &&
      !seller &&
      !material &&
      !feature &&
      !priceRange &&
      includeDesc === "" &&
      !searchQuery
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

      const matchesSearchQuery =
        searchQuery === "" ||
        (product.name &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
        matchesSearchQuery &&
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
    // Only allow reset for buyers
    if (!storeState.isBuyer) {
      messageApi.info("Please login as a buyer to use search and filters.");
      return;
    }
    
    if(title === "" && category === "" && seller === "" && material === "" && feature === "" && priceRange === "" && includeDesc === "" && searchQuery === ""){
      messageApi.info("Please apply at least one filter.");
      return;
    }
    setLoading(true);
    setSkeletonLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSkeletonLoading(false);
    }, 2000);
    setTitle("");
    setCategory("");
    setSeller("");
    setMaterial("");
    setFeature("");
    setPriceRange("");
    setIncludeDesc("");
    setSearchQuery("");
    setFilteredProducts(data);
  };

  const handleLoginFirst = async (productId: string) => {
    if (storeState.islogin) { 
      setDetailPageLoading(true);
      const payload ={
        product: productId,
      }
      try {
        const response = await interaction(payload);
        messageApi.success("Interaction created successfully");
        console.log(response);
      } catch (error:any) {
        console.error("Error fetching interaction:", error);
        const errorMessage = error.response.data.details;
        messageApi.error(errorMessage);
      }
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

  // Fetch trending products when user is logged in
  useEffect(() => {
    if(storeState.islogin){
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
    } else {
      // Clear trending products when user logs out
      setTrending([]);
    }
  }, [storeState.islogin]);

  // Auto-filter products when search query changes (only for buyers)
  useEffect(() => {
    if (!storeState.isBuyer) {
      // If not a buyer, don't apply search filtering
      return;
    }
    
    if (searchQuery.trim() === "") {
      setFilteredProducts(data);
    } else {
      const results = data.filter((product) => {
        return product.name && 
               product.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredProducts(results);
    }
  }, [searchQuery, data, storeState.isBuyer]);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {contextHolder}
      
      {/* State Change Loader */}
      {isStateChanging && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Updating Dashboard...
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we update your dashboard
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
              <span className="mr-1">🔄</span>
              Refreshing your session...
            </div>
          </div>
        </div>
      )}
      
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
      <SearchFilter 
        value={searchQuery} 
        setValue={setSearchQuery} 
        onSearch={applyFilters}
      />

      {!isHydrated ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      ) : storeState.isBuyer ? (
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="w-full md:w-[320px]">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Smart Filters
              </h2>
              <p className="text-blue-100 text-sm mt-1">Discover trending categories</p>
            </div>
            
            <Accordion
              type="single"
              collapsible
              className="rounded-b-xl border-0 bg-white shadow-xl"
            >
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold cursor-pointer hover:bg-blue-50 transition-colors duration-200 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      Top Trending Categories
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    {trending.length > 0 ? (
                      trending.map((item: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200"
                            onClick={() => {
                              router.push(`/detailpage?category=${item.id}`);
                            }}
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Trending now
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                →
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-4xl mb-2">📈</div>
                        <p className="text-gray-500 text-sm">No trending categories yet</p>
                        <p className="text-gray-400 text-xs mt-1">Check back later for updates</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Additional Info Card */}
            <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💡</span>
                <h3 className="font-semibold text-gray-800">Quick Tips</h3>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Click on trending categories to explore
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Use filters to find specific products
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Save your favorite searches
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Advanced Filters
                  </h3>
                  <p className="text-sm text-gray-600">Refine your search results</p>
                </div>
              </div>
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
              <div className="flex justify-end mt-6 gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={applyFilters}
                  loading={loading}
                >
                  <span className="flex items-center gap-2">
                    <span>🔍</span>
                    Apply Filters
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-all duration-200"
                  onClick={resetFilters}
                >
                  <span className="flex items-center gap-2">
                    <span>🔄</span>
                    Reset
                  </span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 cursor-pointer">
              {skeletonloading ? (
                <div className="text-center col-span-full text-gray-500 text-sm">
                  <Skeleton />
                </div>
              ) : Array.isArray(filteredProducts) &&
                filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-r from-white to-gray-50">
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                                                <div className="relative">
                          <img
                            src={product.image || "/placeholder.png"}
                            alt={product.image}
                            className="w-24 h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                          />
                          <div className="mt-2 text-center">
                            <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              Premium Quality
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              In Stock
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-bold text-green-600">
                                {product.price}
                              </span>
                              {product.features && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  Hot Deal
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span>Posted by: </span>
                              <span className="font-semibold text-blue-600">
                                {product.seller?.username}
                              </span>
                            </div>
                            {product.features && (
                              <div className="flex items-center gap-2 text-xs font-semibold text-orange-500">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                {product.features}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleLoginFirst(product.id)}
                            className="mt-4 w-max px-6 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <span className="flex items-center gap-2">
                              <span>👁️</span>
                              View Details
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center col-span-full py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
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
        footer={null}
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
              onClick={() => {
                setTemp(name);
                handlePremiumSelect(name);
              }}
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


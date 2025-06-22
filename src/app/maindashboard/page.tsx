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
import { productView } from "@/api/userApi";

type Product = {
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
  const [showAdPopup, setShowAdPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFetchData() {
      setSkeletonLoading(true);
      try {
        const storedToken = localStorage.getItem("access");
        if (!storedToken) {
          messageApi.error("Unauthorized access. Please login.");
          router.push("/login");
          return;
        }
        const response = await productView();
        if (
          response?.status === 401 ||
          response?.data?.detail === "Unauthorized"
        ) {
          messageApi.error(
            response.data.detail || "Unauthorized access. Please login.",
          );
          router.push("/login");
          return;
        }

        if (response) {
          setData(response);
          setFilteredProducts(response);
        } else {
          console.warn("response is undefined");
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error?.response?.status === 401) {
          messageApi.error("Session expired. Please login again.");
          router.push("/login");
        }
        setSkeletonLoading(false);
      } finally {
        setSkeletonLoading(false);
      }
    }

    getFetchData();
  }, [messageApi, router]);

  if (loginStore.isBuyer) {
    useEffect(() => {
      setAddModal(true);
    }, []);
  }

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
      router.push(`/detailpage?productId=${productId}`);
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

  return (
    <div className="bg-gray-100 min-h-screen">
      {contextHolder}
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

      {loginStore.isBuyer ? (
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
                <AccordionTrigger className="px-4 py-3">
                  Related Categories
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div>- Kitchen Appliances</div>
                  <div>- Cookware & Bakeware</div>
                  <div>- Cutlery & Utensils</div>
                  <div>- Kitchen Storage</div>
                  <div>- Dining & Serveware</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="px-4 py-3">
                  Trending Categories
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div>- Electric Kettles</div>
                  <div>- Food Processors</div>
                  <div>- Mixer Grinders</div>
                  <div>- Microwave Ovens</div>
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
                  className="border rounded px-3 py-2 text-sm text-gray-700"
                  value={includeDesc}
                  onChange={(e) => setIncludeDesc(e.target.value)}
                >
                  <option value="">Include Description?</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
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
                      src="/default-image.jpg"
                      alt={product.name}
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
      ) : (
        <Seller />
      )}

      <Modal
        open={showPremiumModal}
        title={
          <h2 className="text-orange-600 font-bold text-2xl text-center">
            Choose a Premium Plan
          </h2>
        }
        onCancel={() => setShowPremiumModal(false)}
        footer={[
          <div className="flex justify-end gap-2">
            <Button key="cancel" onClick={() => setShowPremiumModal(false)}>
              Cancel
            </Button>
            <Button
              key="save"
              onClick={() => {
                handlePremiumSelect(temp);
                setShowPremiumModal(false);
              }}
              disabled={!temp}
            >
              Save
            </Button>
          </div>,
        ]}
        centered
        className="rounded-xl"
      >
        <div className="flex flex-col gap-5">
          {[
            {
              name: "Silver",
              desc: "Basic boost & visibility",
              color: "#9CA3AF",
            },
            {
              name: "Gold",
              desc: "Priority listing + promotions",
              color: "#F59E0B",
            },
            {
              name: "Platinum",
              desc: "Top-tier exposure & support",
              color: "#2563EB",
            },
          ].map(({ name, desc, color }) => (
            <div
              key={name}
              onClick={() => setTemp(name)}
              className={`p-5 rounded-xl shadow-md hover:shadow-lg cursor-pointer flex items-center justify-between border-l-8 transition duration-300 ${
                temp === name
                  ? "bg-blue-50 ring-2 ring-blue-300 border-blue-500"
                  : ""
              }`}
              style={{ borderColor: color, backgroundColor: "#fff" }}
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {name} Plan
                </h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
              <Badge
                count={<CrownOutlined style={{ color: color }} />}
                style={{ backgroundColor: "transparent" }}
              />
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

/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/page";
import {
  Input,
  Select,
  Modal,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  message,
  Badge,
} from "antd";
import { SaveOutlined, CrownOutlined } from "@ant-design/icons";
import AddModal from "../addmodal";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  productCategory,
  productCreate,
  productSubCategory,
} from "@/api/userApi";

const { TextArea } = Input;
const { Title } = Typography;

export default function Product() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [sellerPreium] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [, setSelectedPlan] = useState("");
  const [temp, setTemp] = useState<string>("");

  type Category = { id: string | number; name: string };
  type SubCategory = {
    id: string | number;
    name: string;
    category: string | number;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [forms, setForms] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    details: "",
    image: null as File | null,
    bussinesstype: "",
    features: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const [, setSavedProductId] = useState<string | number | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      messageApi.error("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      messageApi.error("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setForms((prevForms) => ({ ...prevForms, image: file }));
      setImageUploading(false);
      messageApi.success("Image uploaded successfully!");

      console.log("✅ Image file uploaded:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        isFileInstance: file instanceof File,
      });
    };
    reader.onerror = () => {
      messageApi.error("Failed to read image file");
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setForms({ ...forms, image: null });
    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSave = async () => {
    try {
      // Validation before submission
      if (!forms.name.trim()) {
        messageApi.error("Please enter product name");
        return;
      }
      if (!forms.description.trim()) {
        messageApi.error("Please enter product description");
        return;
      }
      if (!forms.price.trim()) {
        messageApi.error("Please enter product price");
        return;
      }
      if (!forms.category || !forms.subcategory) {
        messageApi.error("Please select a category");
        return;
      }
      if (!forms.image) {
        messageApi.error("Please upload a product image");
        return;
      }

      // Validate image file
      if (!(forms.image instanceof File)) {
        messageApi.error("Invalid image file. Please upload again.");
        return;
      }
      messageApi.loading("Creating your product...", 0);

      const formData = new FormData();
      formData.append("name", forms.name.trim());
      formData.append("description", forms.description.trim());
      formData.append("price", forms.price.trim());
      formData.append("category", forms.category.toString()); // Parent category ID
      formData.append("subcategory", forms.subcategory.toString()); // Subcategory ID
      formData.append("details", forms.details.trim());
      formData.append("bussinesstype", forms.bussinesstype);
      formData.append("features", forms.features.trim());

      // Append image file with proper handling
      formData.append("image", forms.image, forms.image.name);

      console.log("📤 Sending FormData:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      const productResponse = await productCreate(formData);

      messageApi.destroy(); 

      const productId = productResponse.id;
      if (!productId) {
        console.error("❌ No Product ID returned from API!");
        throw new Error("Product ID not returned");
      }

      messageApi.success("🎉 Product created successfully!");
      router.push("/");
      // Reset form
      setForms({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        details: "",
        image: null,
        bussinesstype: "",
        features: "",
      });
      setSelectedCategoryName(""); 

      setImagePreview(null);
      const fileInput = document.getElementById(
        "image-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: unknown) {
      messageApi.destroy(); 
      console.error("❌ Error submitting product:", error);

      const apiError = error as {
        response?: { data?: { image?: string[]; [key: string]: unknown } };
      };
      if (apiError?.response?.data?.image) {
        messageApi.error(`Image Error: ${apiError.response.data.image[0]}`);
      } else if (apiError?.response?.data) {
        const errorMessages = Object.values(apiError.response.data).flat();
        messageApi.error(`Error: ${errorMessages.join(", ")}`);
      } else {
        messageApi.error("Something went wrong. Please try again.");
      }
    }
  };



  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const categoryResponse = await productCategory();
        const subCategoryResponse = await productSubCategory();
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
        setSavedProductId(categoryResponse[0]?.id || null);
        setSubCategories(
          Array.isArray(subCategoryResponse) ? subCategoryResponse : [],
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        messageApi.error("Failed to fetch categories. Try again.");
      }
    };
    fetchCategorys();
  }, []);

  const handlePremiumSelect = (plan: string | null) => {
    if (plan) {
      setSelectedPlan(plan);
      router.push("/premiumplan");
    }
    setShowPremiumModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pb-20">
      <Navbar
        addModal={addModal}
        setAddModal={setAddModal}
        setPremium={setShowPremiumModal}
        premium={sellerPreium}
        selectedPlan=""
        setSelectedPlan={() => {}}
      />
      <ToastContainer position="top-center" autoClose={3000} />
      {contextHolder}

      <div className="max-w-6xl mx-auto mt-8 px-6">
        <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <Title
                level={2}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold mb-2"
              >
                ✨ Create Your Product Masterpiece
              </Title>
              <p className="text-gray-600 text-lg">
                Transform your ideas into amazing products
              </p>
            </div>
            <Divider className="border-gradient-to-r from-purple-200 to-pink-200" />

            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📸 Upload Product Image
              </label>

              {/* Image Preview Section */}
              {imagePreview ? (
                <div className="relative mb-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-40 h-40 object-cover rounded-xl shadow-lg border-2 border-white"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 shadow-lg"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click the ✕ to remove image
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-white/50">
                  <div className="space-y-3">
                    <div className="text-6xl">📷</div>
                    <p className="text-gray-600">
                      Drop your image here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPEG, PNG, WebP (Max: 5MB)
                    </p>
                    <p className="text-xs text-purple-500 font-medium mt-2 bg-purple-50 px-3 py-1 rounded-full inline-block">
                      ✨ You can add only one image per product
                    </p>
                  </div>
                </div>
              )}

              {/* File Input */}
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:shadow-lg file:transition-all file:duration-300 file:disabled:opacity-50 mt-4"
              />

              {/* Upload Status */}
              {imageUploading && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Processing image...</span>
                </div>
              )}
            </div>

            <Row gutter={[32, 32]} className="mt-8">
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    🏷️ Product Name
                  </label>
                  <Input
                    placeholder="Enter your amazing product name"
                    value={forms.name}
                    onChange={(e) =>
                      setForms({ ...forms, name: e.target.value })
                    }
                    size="large"
                    className="rounded-xl border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 shadow-sm"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    💰 Price
                  </label>
                  <Input
                    placeholder="Set your price"
                    value={forms.price}
                    onChange={(e) =>
                      setForms({ ...forms, price: e.target.value })
                    }
                    size="large"
                    type="number"
                    className="rounded-xl border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 shadow-sm"
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    📝 Product Description
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Tell us what makes your product special..."
                    value={forms.description}
                    onChange={(e) =>
                      setForms({ ...forms, description: e.target.value })
                    }
                    className="rounded-xl border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 shadow-sm"
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={[32, 32]} className="mt-8">
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    📂 Category
                  </label>
                  <Button
                    type="dashed"
                    block
                    size="large"
                    onClick={() => setShowCategoryModal(true)}
                    className="h-12 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-purple-600 font-semibold"
                  >
                    {selectedCategoryName || "🎯 Select Product Category"}
                  </Button>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    🏢 Business Type
                  </label>
                  <Select
                    placeholder="Choose your business type"
                    className="w-full"
                    value={forms.bussinesstype}
                    size="large"
                    onChange={(value) =>
                      setForms({ ...forms, bussinesstype: value })
                    }
                  >
                    <Select.Option value="exporter">📤 Exporter</Select.Option>
                    <Select.Option value="wholesaler">
                      🏪 Wholesaler
                    </Select.Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <Row gutter={[32, 32]} className="mt-8">
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    ⭐ Features
                  </label>
                  <Input
                    value={forms.features}
                    placeholder="Highlight key features and benefits"
                    size="large"
                    onChange={(e) =>
                      setForms({ ...forms, features: e.target.value })
                    }
                    className="rounded-xl border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 shadow-sm"
                  />
                </div>
              </Col>
            </Row>

            <div className="mt-12 text-center space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  size="large"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 px-12 py-3 h-auto rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={handleSave}
                >
                  🚀 Launch Product
                </Button>
              </div>
              <div className="space-x-4">
                <Button
                  type="default"
                  icon={<CrownOutlined />}
                  className="text-blue-600 border-2 border-blue-300 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl px-8 py-2 h-auto font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setShowPremiumModal(true)}
                >
                  ✨ Unlock Premium Features
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showCategoryModal}
        title={
          <div className="text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              📂 Choose Your Category
            </h2>
            <p className="text-gray-600">
              Select the perfect category for your product
            </p>
          </div>
        }
        onCancel={() => setShowCategoryModal(false)}
        footer={null}
        className="rounded-2xl"
        width={600}
      >
        <div className="space-y-6 mt-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                🏷️ {cat.name}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {subCategories
                  .filter((sub) => sub.category === cat.id)
                  .map((sub) => (
                    <Button
                      key={sub.id}
                      type="default"
                      block
                      onClick={() => {
                        console.log("🔖 Subcategory selected:", {
                          id: sub.id,
                          name: sub.name,
                          category: sub.category
                        });
                        setForms({ 
                          ...forms, 
                          category: String(sub.category), 
                          subcategory: String(sub.id) 
                        });
                        setSelectedCategoryName(sub.name); 
                        setShowCategoryModal(false);
                      }}
                      className="text-left justify-start rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 border-gray-200 hover:border-purple-300"
                    >
                      <span className="flex items-center gap-2">
                        📌 {sub.name}
                      </span>
                    </Button>
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
    </div>
  );
}

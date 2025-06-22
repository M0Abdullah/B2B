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
  Rate,
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
  const [sellerPreium, setSellerPremium] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("");
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
    details: "",
    image: null as File | null,
    bussinesstype: "",
    features: "",
  });

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const [savedProductId, setSavedProductId] = useState<string | number | null>(
    null,
  );


  const handleSave = async () => {
    try {

      const formData = new FormData();
      formData.append("name", forms.name);
      formData.append("description", forms.description);
      formData.append("price", forms.price);
      formData.append("category", forms.category); 
      formData.append("details", forms.details);
      formData.append("bussinesstype", forms.bussinesstype);
      formData.append("features", forms.features);
      if (forms.image) {
        formData.append("image", forms.image, forms.image.name);
      }

      const productResponse = await productCreate(formData);
      const productId = productResponse.id;
      if (!productId) {
        console.error("❌ No Product ID returned from API!");
        throw new Error("Product ID not returned");
      }

      messageApi.success("Product created! Please leave a review.");
      setForms({
        name: "",
        description: "",    
        price: "",

        category: "",
        details: "",
        image: null,
        bussinesstype: "",
        features: "",
      });
    } catch (error) {
      console.error("❌ Error submitting product:", error);
      messageApi.error("Something went wrong. Try again.");
    }
  };

  const handleReviewSubmit = async () => {
    try {
      if (!savedProductId) {
        messageApi.error("No product found to review.");
        return;
      }

      const reviewFormData = new FormData();
      reviewFormData.append("product", savedProductId.toString());
      reviewFormData.append("rating", String(reviewData.rating));
      reviewFormData.append("comment", reviewData.comment);

      messageApi.success("Review submitted!");
      setReviewData({ rating: 5, comment: "" });
    } catch (err) {
      console.error("❌ Review submit error:", err);
      messageApi.error("Failed to submit review.");
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pb-20">
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

      <div className="max-w-5xl mx-auto mt-10 px-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border">
          <Title
            level={3}
            className="text-center text-orange-600 font-semibold"
          >
            🚀 Add Your New Product
          </Title>
          <Divider />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setForms({ ...forms, image: e.target.files[0] });
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} md={12}>
              <Input
                placeholder="Product Name"
                value={forms.name}
                onChange={(e) => setForms({ ...forms, name: e.target.value })}
                size="large"
              />
            </Col>
            <Col xs={24} md={12}>
              <Input
                placeholder="Price"
                value={forms.price}
                onChange={(e) => setForms({ ...forms, price: e.target.value })}
                size="large"
                type="number"
              />
            </Col>
            <Col span={24}>
              <TextArea
                rows={4}
                placeholder="Product Description"
                value={forms.description}
                onChange={(e) =>
                  setForms({ ...forms, description: e.target.value })
                }
              />
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} md={12}>
              <label className="block mb-1 text-gray-600 font-medium">
                Category
              </label>
              <Button
                type="dashed"
                block
                size="large"
                onClick={() => setShowCategoryModal(true)}
              >
                {forms.category || "+ Add Product Category"}
              </Button>
            </Col>

            <Col xs={24} md={12}>
              <label className="block mb-1 text-gray-600 font-medium">
                Business Type
              </label>
              <Select
                placeholder="Select Type"
                className="w-full"
                value={forms.bussinesstype}
                size="large"
                onChange={(value) =>
                  setForms({ ...forms, bussinesstype: value })
                }
              >
                <Select.Option value="importer">Importer</Select.Option>
                <Select.Option value="exporter">Exporter</Select.Option>
                <Select.Option value="wholesaler">Wholesaler</Select.Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} md={12}>
              <Input
                value={forms.features}
                placeholder="Features / Product features"
                size="large"
                onChange={(e) =>
                  setForms({ ...forms, features: e.target.value })
                }
              />
            </Col>
            
          </Row>

          <div className="mt-10 text-center space-y-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              className="bg-green-600 hover:bg-green-700 px-10 rounded-xl"
              onClick={handleSave}
            >
              Save Product
            </Button>
            <div className="space-x-4">
              <Button
                type="default"
                icon={<CrownOutlined />}
                className="text-blue-600 border-blue-600 hover:text-blue-800"
                onClick={() => setShowPremiumModal(true)}
              >
                Want Premium Features?
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showCategoryModal}
        title="Select Product Category"
        onCancel={() => setShowCategoryModal(false)}
        footer={null}
      >
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-bold text-gray-700">{cat.name}</h3>
              <div className="pl-4 space-y-1">
                {subCategories
                  .filter((sub) => sub.category === cat.id)
                  .map((sub) => (
                    <Button
                      key={sub.id}
                      type="link"
                      block
                      onClick={() => {
                        setForms({ ...forms, category: String(sub.id) });
                        setShowCategoryModal(false);
                      }}
                    >
                      {sub.name}
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
    </div>
  );
}

"use client";
import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import loginStore from "../store/page";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface AddModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ onClose, onAdd }) => {
  const [fileList, setFileList] = useState<
    import("antd/es/upload/interface").UploadFile<any>[]
  >([]);
  const [descriptions, setDescriptions] = useState(["", "", ""]);
  const [premium, setPremium] = useState("Gold");
  const loginstore = loginStore;
  const router = useRouter();
  const [dateRange, setDateRange] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<any>(null);

  const sampleImages = [
    {
      url: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400",
    },
    {
      url: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
    },
    {
      url: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400",
    },
  ];

  const handleDescriptionChange = (index: number, value: string) => {
    const newDesc = [...descriptions];
    newDesc[index] = value;
    setDescriptions(newDesc);
  };

  const handleSubmit = () => {
    onAdd();
    onClose();
    router.push("/premiumplan");
  };

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      className="custom-modal"
    >
      {loginstore.isSeller ? (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <span className="text-white text-2xl">📢</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Premium Ad
            </h2>
            <p className="text-gray-600 text-sm">
              Showcase your product to thousands of potential buyers
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Product Images
            </h3>
            <div className="text-center">
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList.slice(0, 3))}
                beforeUpload={() => false}
                multiple
                className="upload-enhanced"
              >
                <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 px-8 py-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                      <UploadOutlined className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-blue-700 font-semibold">
                        Upload up to 3 Images
                      </p>
                      <p className="text-gray-500 text-sm">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>
              </Upload>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Product Descriptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {descriptions.map((desc, index) => (
                <div key={index} className="relative group">
                  <TextArea
                    rows={3}
                    value={desc}
                    placeholder={`Description ${index + 1}`}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-colors duration-200 resize-none"
                  />
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Ad Settings
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Premium Package
                  </label>
                  <Select
                    value={premium}
                    onChange={setPremium}
                    className="w-full"
                    size="large"
                    options={[
                      { label: "🥇 Gold - Premium Visibility", value: "Gold" },
                      { label: "🥈 Silver - Standard Boost", value: "Silver" },
                      {
                        label: "💎 Platinum - Maximum Exposure",
                        value: "Platinum",
                      },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Campaign Duration
                  </label>
                  <RangePicker
                    className="w-full"
                    size="large"
                    onChange={(dates) => setDateRange(dates)}
                    placeholder={["Start Date", "End Date"]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Active Hours
                </label>
                <TimePicker.RangePicker
                  className="w-full"
                  size="large"
                  format="HH:mm"
                  onChange={(times) => setTimeRange(times)}
                  placeholder={["Start Time", "End Time"]}
                />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <span className="text-lg">🚀</span>
              <span>Launch Your Premium Ad</span>
            </button>
            <p className="text-center text-gray-500 text-sm mt-3">
              Your ad will be reviewed and published within 24 hours
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
              <span className="text-white text-3xl">📸</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Advertisement Preview
            </h2>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              You are viewing a demo advertisement submitted by a buyer. This is
              how your ads will appear to potential customers.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Featured Product Gallery
              <span className="w-3 h-3 bg-green-500 rounded-full ml-3"></span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {(fileList.length > 0 ? fileList : sampleImages).map(
                (file: any, index: number) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                      <Image
                        src={file.thumbUrl || file.url || ""}
                        width={200}
                        height={200}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-green-600 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium">
                        Product View {index + 1}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
              Premium Features Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✨</span>
                </div>
                <span className="text-green-800 font-medium">
                  Premium Visibility
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📈</span>
                </div>
                <span className="text-blue-800 font-medium">
                  Enhanced Analytics
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">🎯</span>
                </div>
                <span className="text-purple-800 font-medium">
                  Targeted Reach
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">⚡</span>
                </div>
                <span className="text-orange-800 font-medium">
                  Priority Support
                </span>
              </div>
            </div>
          </div>
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
            >
              <span className="text-lg">👍</span>
              <span>Looks Great!</span>
            </button>
            <p className="text-center text-gray-500 text-sm mt-3">
              Ready to create your own premium advertisement?
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddModal;

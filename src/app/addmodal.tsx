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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import loginStore from "../store/page";
=======
=======
>>>>>>> Stashed changes
<<<<<<< HEAD
import loginStore from "./store/page";
=======
import loginStore from "../store/page";
>>>>>>> d20b2a7 (Initial commit with project files)
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
    <Modal open onCancel={onClose} footer={null} centered width={600}>
      {loginstore.isSeller ? (
        <div className="space-y-6 p-4">
          <h2 className="text-xl font-bold text-blue-600 text-center">
            📢 Create Your Ad
          </h2>

          <div className="text-center">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(0, 3))}
              beforeUpload={() => false}
              multiple
            >
              <button className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 shadow-sm">
                <UploadOutlined /> Upload up to 3 Images
              </button>
            </Upload>
          </div>
          <div className="flex flex-wrap gap-4">
            {descriptions.map((desc, index) => (
              <TextArea
                key={index}
                rows={2}
                className="flex-1 min-w-[47%]"
                value={desc}
                placeholder={`Description ${index + 1}`}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
              />
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={premium}
              onChange={setPremium}
              className="w-full md:w-1/2"
              options={[
                { label: "Gold", value: "Gold" },
                { label: "Silver", value: "Silver" },
                { label: "Platinum", value: "Platinum" },
              ]}
            />
            <RangePicker
              className="w-full md:w-1/2"
              onChange={(dates) => setDateRange(dates)}
              placeholder={["Start Date", "End Date"]}
            />
          </div>

          <TimePicker.RangePicker
            className="w-full"
            format="HH:mm"
            onChange={(times) => setTimeRange(times)}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 mt-10 text-white px-4 py-2 rounded w-full shadow-md transition"
          >
            Submit Ad
          </button>
        </div>
      ) : (
        <div className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-green-600">
            📸 Advertisement Preview
          </h2>
          <p className="text-gray-600">
            You are viewing a demo advertisement submitted by a buyer.
          </p>

          <div className="flex justify-center flex-wrap gap-4">
            {(fileList.length > 0 ? fileList : sampleImages).map(
              (file: any, index: number) => (
                <Image
                  key={index}
                  src={file.thumbUrl || file.url || ""}
                  width={150}
                  height={150}
                  alt={`Ad Image ${index + 1}`}
                  className="rounded shadow"
                />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              )
=======
=======
>>>>>>> Stashed changes
<<<<<<< HEAD
              ),
=======
              )
>>>>>>> d20b2a7 (Initial commit with project files)
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddModal;

"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import loginStore from "@/store/page";
import { message } from "antd";
import { useRouter } from "next/navigation";

interface SearchFilterProps {
  value?: string;
  setValue?: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchFilter({ value = "", setValue = () => {}, onSearch }: SearchFilterProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  
  function handleInfo() {
    messageApi.info(
      "Kitchen Mart is a premium seller on USMarket.com, Please go to Seller Dashboard to post your product.",
    );
  }
  
  const handleProducts = () => {
    router.push("/product");
  };

  return (
    <div className="w-full bg-gradient-to-r from-white to-blue-200 py-4 shadow-sm">
      {contextHolder}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="text-lg font-bold font-sans text-gray-800">
          USMarket.com <span className="text-blue-600">B2B Market</span>
        </div>
        <div className="relative w-full max-w-md ">
          <Input
            type="text"
            value={value}
            onChange={(e) => loginStore.isBuyer ? setValue?.(e.target.value) : null}
            placeholder={loginStore.isSeller ? "Please Login as a buyer to search" : "Enter Product / service to search"}
            className={`w-full h-14 pl-5 pr-14 rounded-4xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-800 text-base ${
              loginStore.isSeller ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loginStore.isSeller}
          />
          <Button
            size="icon"
            onClick={loginStore.isBuyer ? onSearch : undefined}
            className={`absolute right-2 top-2.5 h-9 w-9 rounded-md ${
              loginStore.isBuyer 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
            }`}
            disabled={loginStore.isSeller}
          >
            <Search size={18} />
          </Button>
        </div>
        <div>
          {loginStore.isSeller ? (
            <Button
              onClick={handleProducts}
              className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Post your product
            </Button>
          ) : (
            <div
              className=" cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
              onClick={handleInfo}
            >
              Kitchen Mart
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 

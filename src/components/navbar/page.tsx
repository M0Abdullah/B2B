/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import loginStore from "../../store/page";
import { message } from "antd"; 

interface NavbarProps {
  selectedPlan: string;
  setSelectedPlan: (value: string) => void;
  premium: boolean;
  setPremium: (value: boolean) => void;
  addModal: boolean;
  setAddModal: (value: boolean) => void;
}

const Navbar = ({
  premium,
  setPremium,
  selectedPlan,
  setSelectedPlan,
  addModal,
  setAddModal,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [buyerDropdownOpen, setBuyerDropdownOpen] = useState(false);
  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string, text: string) => {
    const isAlreadyOnPage = 
      (path === "/" && (pathname === "/" || pathname === "/maindashboard")) ||
      (path === "/maindashboard" && (pathname === "/" || pathname === "/maindashboard")) ||
      pathname === path;
      if (isAlreadyOnPage) {
      setMenuOpen(false); 
      return;
    }
    const publicRoutes = ["/", "/maindashboard", "/login", "/signup"];
    const isPublicRoute = publicRoutes.includes(path);
    const isLoggedIn = loginStore.islogin;

    if (!isLoggedIn && !isPublicRoute) {
      messageApi.error("Please login to access this page");
      return;
    }

    setIsLoading(true);
    setLoadingText(text);
    setMenuOpen(false);
    setTimeout(() => {
      router.push(path);
    }, 600);
  };

  const handlePremiumSelect = () => setPremium(true);
  const handleLogin = () =>
    handleNavigation("/login", "Redirecting to Login...");
  const addModalOpen = () => setAddModal(true);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleSwitchToSeller = () => {
    router.push("/signup");
    setBuyerDropdownOpen(false);
    loginStore.reset();
  };

  const handleSignOut = () => {
    loginStore.reset();
    setSellerDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.buyer-dropdown')) {
        setBuyerDropdownOpen(false);
      }
      if (!target.closest('.seller-dropdown')) {
        setSellerDropdownOpen(false);
      }
    };

    if (buyerDropdownOpen || sellerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buyerDropdownOpen, sellerDropdownOpen]);

  const getNavItemClasses = (path: string) => {
    let isActive = false;
      if (path === "/maindashboard") {
      isActive = pathname === "/" || pathname === "/maindashboard";
    } else if (path === "/premiumplan") {
      isActive = pathname === "/premiumplan" || pathname === "/stripecard";
    } else if (path === "/product") {
      isActive = pathname === "/product" || pathname === "/seller";
    } else {
      isActive = pathname === path;
    }
    
    return `block py-2 px-3 cursor-pointer transition-all duration-200 bg-transparent border-none rounded-lg ${
      isActive
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium"
        : "text-gray-900 hover:bg-blue-50 hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-blue-300"
    }`;
  };

  return (
    <>
      {contextHolder}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {loadingText}
            </h3>
            <p className="text-gray-600 text-sm">Please wait...</p>
            <div className="mt-3 flex space-x-1">
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
          </div>
        </div>
      )}
      <nav className="bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <button
            onClick={() => handleNavigation("/", "Loading Dashboard...")}
            className={`flex items-center space-x-3 rtl:space-x-reverse bg-transparent border-none cursor-pointer rounded-lg px-2 py-1 transition-all duration-200 ${
              pathname === "/" || pathname === "/maindashboard"
                ? "bg-blue-100 dark:bg-blue-900"
                : "hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className={`self-center text-2xl font-semibold whitespace-nowrap transition-colors duration-200 ${
              pathname === "/" || pathname === "/maindashboard"
                ? "text-blue-700 dark:text-blue-300"
                : "text-gray-900 dark:text-white"
            }`}>
              Flowbite
            </span>
          </button>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 17 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              menuOpen ? "flex" : "hidden"
            } items-center justify-between font-medium w-full md:flex md:w-auto md:order-1`}
            id="mega-menu-full"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {loginStore.isSeller && (
                <li>
                  <button
                    onClick={() =>
                      handleNavigation("/product", "Loading Products...")
                    }
                    className={getNavItemClasses("/product")}
                  >
                    Add Product
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => handleNavigation("/", "Loading Dashboard...")}
                  className={getNavItemClasses("/maindashboard")}
                >
                  MainDashboard
                </button>
              </li>

              {loginStore.isSeller  && (
                <li>
                  <button
                    onClick={handlePremiumSelect}
                    className={getNavItemClasses("/premiumplan")}
                  >
                    Premium Plan
                  </button>
                </li>
              )}

              {
  loginStore.isSeller ? (
    <li className="relative">
      <button
        onClick={() => setSellerDropdownOpen(!sellerDropdownOpen)}
        className="block py-2 px-3 cursor-pointer transition-all duration-200 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium border-none rounded-lg flex items-center gap-1"
      >
        Login as Seller
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {sellerDropdownOpen && (
        <div className="seller-dropdown cursor-pointer absolute top-full left-0 mt-1 w-[148px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={handleSignOut}
            className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      )}
    </li>
  ) : loginStore.islogin && loginStore.isBuyer ? (
    <li className="relative">
      <button
        onClick={() => setBuyerDropdownOpen(!buyerDropdownOpen)}
        className="block py-2 px-3 cursor-pointer transition-all duration-200 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-medium border-none rounded-lg flex items-center gap-1"
      >
        Login as Buyer
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {buyerDropdownOpen && (
        <div className="buyer-dropdown cursor-pointer absolute top-full left-0 mt-1 w-[148px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={handleSwitchToSeller}
            className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
          >
            Switch to Seller
          </button>
        </div>
      )}
    </li>
  ) : (
    <li>
      <button
        onClick={handleLogin}
        className={getNavItemClasses("/login")}
      >
        Login
      </button>
    </li>
  )}
              {loginStore.isSeller &&
                pathname !== "/stripecard" &&
                pathname !== "/premiumplan" && (
                  <li>
                    <button
                      onClick={addModalOpen}
                      className="block py-2 px-3 cursor-pointer text-gray-900 hover:bg-blue-50 hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-blue-300 bg-transparent border-none rounded-lg transition-all duration-200"
                    >
                      Ads
                    </button>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;


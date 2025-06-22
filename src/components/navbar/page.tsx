"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import loginStore from "../../store/page";

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
  const [menuOpen, setMenuOpen] = useState(false); // 👈 mobile toggle state
  const pathname = usePathname();
  const router = useRouter();

  const handlePremiumSelect = () => setPremium(true);
  const handleLogin = () => router.push("/login");
  const addModalOpen = () => setAddModal(true);
  const toggleMenu = () => setMenuOpen(!menuOpen); // 👈 toggle function

  return (
    <nav className="bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span>
        </a>

        {/* Mobile Toggle Button */}
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

        {/* Menu Items */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } items-center justify-between font-medium w-full md:flex md:w-auto md:order-1`}
          id="mega-menu-full"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                onClick={() => router.push("/")}
                className="block py-2 px-3 cursor-pointer text-gray-900 hover:text-blue-700 dark:text-white"
              >
                MainDashboard
              </a>
            </li>

            {loginStore.isSeller && pathname !== "/stripecard" && (
              <li>
                <a
                  onClick={handlePremiumSelect}
                  className="block py-2 px-3 cursor-pointer text-gray-900 hover:text-blue-700 dark:text-white"
                >
                  Premium
                </a>
              </li>
            )}

            <li>
              <a
                onClick={handleLogin}
                className="block py-2 px-3 cursor-pointer text-gray-900 hover:text-blue-700 dark:text-white"
              >
                Login
              </a>
            </li>

            {loginStore.isSeller && (
              <li>
                <a
                  onClick={() => router.push("/product")}
                  className="block py-2 px-3 cursor-pointer text-gray-900 hover:text-blue-700 dark:text-white"
                >
                  Add Product
                </a>
              </li>
            )}

            {loginStore.isSeller &&
              pathname !== "/stripecard" &&
              pathname !== "/premiumplan" && (
                <li>
                  <a
                    onClick={addModalOpen}
                    className="block py-2 px-3 cursor-pointer text-gray-900 hover:text-blue-700 dark:text-white"
                  >
                    Ad's
                  </a>
                </li>
              )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";
import { useRouter, usePathname } from "next/navigation";
import loginStore from "../../store/page";

interface Navbar {
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
}: Navbar) => {
  const handlePremiumSelect = () => {
    setPremium(true);
  };
  const pathname = usePathname();

  function addModalOpen() {
    setAddModal(true);
  }

  const router = useRouter();
  function handleLogin() {
    router.push("/login");
  }
  return (
    <nav className="bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <a
          href="https://flowbite.com"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span>
        </a>
        <button
          data-collapse-toggle="mega-menu-full"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mega-menu-full"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
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
          id="mega-menu-full"
          className="items-center justify-between font-medium hidden w-full md:flex md:w-auto md:order-1"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                onClick={() => router.push("/")}
                className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
              >
                MainDashboard
              </a>
            </li>
            {loginStore.isSeller && pathname !== "/stripecard" && (
              <li>
                <button
                  onClick={handlePremiumSelect}
                  id="mega-menu-full-dropdown-button"
                  data-collapse-toggle="mega-menu-full-dropdown"
                  className="flex items-center cursor-pointer justify-between w-full py-2 px-3 text-gray-900 rounded-sm md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <span className="flex items-center gap-2">Premium</span>
                </button>
              </li>
            )}
            <li>
              <a
                onClick={() => handleLogin()}
                className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Login
              </a>
            </li>
            {loginStore.isSeller && (
              <li>
                <a
                  onClick={() => router.push("/product")}
                  className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
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
                    className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
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
}
export default Navbar;
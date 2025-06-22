import { useRouter } from "next/navigation";

export default function Seller() {
  const router = useRouter();
  const handleProducts = () => {
    router.push("/product");
  };
  return (
    <div className="flex flex-col items-center justify-center  bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold  text-gray-800 mb-4 text-center">
        Welcome to the Seller Dashboard
      </h1>

      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        Manage your products, view your sales, and stay on top of your
        orders—all in one simple and powerful dashboard.
      </p>

      <button
        onClick={() => handleProducts()}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
      >
        Get Started
      </button>
    </div>
  );
}

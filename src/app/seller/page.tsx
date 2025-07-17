/* eslint-disable react/no-unescaped-entities */
"use client";
import { interactionView, productViewSeller, productViewSellerDelete, productViewSellerUpdate } from "@/api/userApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TypeScript interfaces
interface Buyer {
  username: string;
  email: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
}

interface Interaction {
  id: number;
  buyer: Buyer;
  product: number;
  number_of_interactions: number;
  last_interacted_at: string;
}

interface Review {
  rating: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string;
  category: number;
  subcategory: number;
  image: string;
  created_at: string;
  reviews: Review[];
}

export default function Seller() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    category: "",
    subcategory: ""
  });

  const handleProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/product");
    }, 800);
  };

  const getInteraction = async () => {
    try {
      const response = await interactionView();
      console.log("Interactions:", response);
      setInteractions(response || []);
    } catch (error) {
      console.error("Error fetching interaction:", error);
    }
  };

  const getSellerProductsData = async () => {
    try {
      const response = await productViewSeller();
      console.log("Seller Products:", response);
      setProducts(response || []);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      features: product.features,
      category: product.category.toString(),
      subcategory: product.subcategory.toString()
    });
  };

  const handleUpdateProduct = async (id: number) => {
    if (!id) return;
    
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("features", editForm.features);
      formData.append("category", editForm.category);

      await productViewSellerUpdate(id, formData);
      setEditingProduct(null);
      getSellerProductsData(); // Refresh products
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productViewSellerDelete(productId);
        getSellerProductsData(); // Refresh products
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  useEffect(() => {
    getInteraction();
    getSellerProductsData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Product Management...
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we prepare your product dashboard
            </p>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <span className="mr-1">🛍️</span>
              Setting up your seller tools...
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
        Welcome to the Seller Dashboard
      </h1>

      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        Manage your products, view your sales, and stay on top of your
        orders—all in one simple and powerful dashboard.
      </p>

      <button
        onClick={() => handleProducts()}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 mb-10"
      >
        Add New Product
      </button>

      {/* 🔽 Interactions Section */}
      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          👥 Buyer Interactions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interactions.length > 0 ? (
            interactions.map((item: Interaction) => (
              <div
                key={item.id}
                className="bg-white border border-blue-100 rounded-2xl shadow hover:shadow-lg transition duration-300 p-6 relative group"
              >
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-t-2xl" />

                <div className="mt-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    👤 {item.buyer.username}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    📧 <span>{item.buyer.email}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    📞 <span>{item.buyer.phone_number}</span>
                  </p>

                  <div className="text-sm text-gray-700 flex items-center gap-2 mb-2">
                    📍
                    <span>
                      {item.buyer.city}, {item.buyer.state}, {item.buyer.country}
                    </span>
                  </div>

                  {/* Number of Interactions Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full shadow">
                      {item.number_of_interactions} {item.number_of_interactions === 1 ? 'Interaction' : 'Interactions'}
                    </span>
                  </div>

                  {/* Last Interaction Timestamp */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      Last Interacted: {item.last_interacted_at ? new Date(item.last_interacted_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Product ID: {item.product}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {item.last_interacted_at ? new Date(item.last_interacted_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Hover Hint */}
                <div className="absolute top-2 right-2 bg-blue-50 text-blue-500 text-xs font-medium px-2 py-1 rounded shadow-sm group-hover:scale-105 transition-transform">
                  New View
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No buyer interactions yet.
            </p>
          )}
        </div>
      </div>

      {/* 🔽 Products Section */}
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📦 My Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white border border-green-100 rounded-2xl shadow hover:shadow-lg transition duration-300 p-6 relative group"
              >
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-t-2xl" />

                {/* Product Image */}
                <div className="mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>

                <div className="mt-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    🏷️ {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📝 {product.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    💰 Price: ${product.price}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    ⚡ Features: {product.features}
                  </p>

                  {/* Reviews Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-700">⭐ Reviews:</span>
                      <span className="text-sm text-gray-600">{product.reviews.length}</span>
                    </div>
                    {product.reviews.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Avg Rating: {(product.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)}/5
                      </div>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition duration-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2 bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded shadow-sm">
                  Active
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No products uploaded yet. Click "Add New Product" to get started!
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <textarea
                  value={editForm.features}
                  onChange={(e) => setEditForm({...editForm, features: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdateProduct(editingProduct.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Update Product
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

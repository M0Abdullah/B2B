/* eslint-disable react/no-unescaped-entities */
"use client";
import { interactionView, productViewSeller, productViewSellerDelete, productViewSellerUpdate } from "@/api/userApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
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
    
    setUpdatingProductId(id);
    
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("features", editForm.features);
      formData.append("category", editForm.category);

      await productViewSellerUpdate(id, formData);
      setEditingProduct(null);
      getSellerProductsData();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setDeletingProductId(productToDelete.id);
    
    try {
      await productViewSellerDelete(productToDelete.id);
      getSellerProductsData(); 
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full shadow">
                      {item.number_of_interactions} {item.number_of_interactions === 1 ? 'Interaction' : 'Interactions'}
                    </span>
                  </div>
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-t-2xl" />
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
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      disabled={updatingProductId === product.id}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      {updatingProductId === product.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        "✏️ Edit"
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      disabled={deletingProductId === product.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      {deletingProductId === product.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        "🗑️ Delete"
                      )}
                    </button>
                  </div>
                </div>
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
                disabled={updatingProductId === editingProduct.id}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {updatingProductId === editingProduct.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                disabled={updatingProductId === editingProduct.id}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 w-full">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{productToDelete.name}"</span>? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingProductId === productToDelete.id}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {deletingProductId === productToDelete.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
              <button
                onClick={handleDeleteCancel}
                disabled={deletingProductId === productToDelete.id}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
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

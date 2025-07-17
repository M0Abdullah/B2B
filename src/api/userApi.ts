/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance";

export const registerUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post("/signup/", userData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const registerUserOtp = async (userData: any) => {
  try {
    const response = await axiosInstance.post("/verified-signup/", userData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const login = async (userData: any) => {
  try {
    const response = await axiosInstance.post("/login/", userData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const otp1 = async (email: string) => {
  try {
    const response = await axiosInstance.post("/forgot-password/", { email });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const otp2 = async (
  email: string,
  otp: string,
  new_password: string,
) => {
  try {
    const response = await axiosInstance.post("/reset-password/", {
      email,
      otp,
      new_password,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productView = async () => {
  try {
    const response = await axiosInstance.get("/products/");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productViewSeller = async () => {
  try {
    const response = await axiosInstance.get("/products/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productViewSellerUpdate = async (id: number, formData: FormData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}/update/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": undefined, // Let browser set multipart/form-data with boundary
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productViewSellerDelete = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": undefined, // Let browser set multipart/form-data with boundary
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const productViewById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/products/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productCreate = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(`/products/create/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": undefined, // Let browser set multipart/form-data with boundary
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productByCategory = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/products/?category=${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": undefined, // Let browser set multipart/form-data with boundary
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const reviewProduct = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(`/reviews/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const productCategory = async () => {
  try {
    const response = await axiosInstance.get(`/categories/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const productSubCategory = async () => {
  try {
    const response = await axiosInstance.get(`/subcategories/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const productis_Trending = async () => {
  try {
    const response = await axiosInstance.get(`/categories/?is_trending=true`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const interaction = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/interactions/create/`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const interactionView = async () => {
  try {
    const response = await axiosInstance.get(`/interactions/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


import api from "./api";

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/uploads/product-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};


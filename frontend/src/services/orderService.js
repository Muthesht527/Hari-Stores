import api from "./api";

export const createRazorpayOrder = async (items) => {
  const { data } = await api.post("/orders/create-razorpay-order", { items });
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await api.post("/orders/verify-payment", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/mine");
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus });
  return data;
};


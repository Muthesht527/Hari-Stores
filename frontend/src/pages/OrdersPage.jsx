import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyOrders } from "../services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading orders...</div>;
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft">
      <h1 className="mb-6 text-2xl font-bold">Order History</h1>
      <div className="space-y-4">
        {orders.length === 0 && <p className="text-slate-500">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                {order.orderStatus}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 text-right font-bold">
              Total: Rs. {order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


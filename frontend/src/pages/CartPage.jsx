import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createRazorpayOrder, verifyPayment } from "../services/orderService";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCheckout = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        toast.error("Failed to load Razorpay checkout");
        setLoading(false);
        return;
      }

      const orderData = await createRazorpayOrder(
        cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hari Enterprises",
        description: "Order payment",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            toast.success("Payment successful and order placed");
            navigate("/orders");
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: {
          color: "#e67e22",
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-slate-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
              >
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-slate-500">Rs. {item.price}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="w-24 rounded-xl border border-slate-300 px-3 py-2"
                />
                <button onClick={() => removeFromCart(item.productId)} className="text-red-600">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <aside className="h-fit rounded-[2rem] bg-slate-900 p-6 text-white shadow-soft">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
          <span>Items</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
          <span>Total</span>
          <span>Rs. {cartTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading || !cartItems.length}
          className="mt-8 w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white disabled:bg-slate-600"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </aside>
    </div>
  );
}


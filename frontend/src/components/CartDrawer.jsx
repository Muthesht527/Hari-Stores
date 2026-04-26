import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <div className={`fixed inset-0 z-30 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-soft transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>

        <div className="space-y-4">
          {cartItems.length === 0 && <p className="text-sm text-slate-500">Your cart is empty.</p>}
          {cartItems.map((item) => (
            <div key={item.productId} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-slate-500">Rs. {item.price}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="w-20 rounded-lg border border-slate-300 px-3 py-2"
                />
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-sm font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="mb-4 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>Rs. {cartTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/cart"
            onClick={onClose}
            className="block rounded-2xl bg-brand-500 px-4 py-3 text-center font-semibold text-white"
          >
            Go to Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}


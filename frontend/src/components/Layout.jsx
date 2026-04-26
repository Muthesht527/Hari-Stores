import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-2xl font-bold text-brand-700">
            Hari Enterprises
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className="text-sm font-medium text-slate-600 hover:text-brand-700">
              Shop
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/orders"
                  className="text-sm font-medium text-slate-600 hover:text-brand-700"
                >
                  Orders
                </NavLink>
                <NavLink
                  to="/profile"
                  className="text-sm font-medium text-slate-600 hover:text-brand-700"
                >
                  Profile
                </NavLink>
              </>
            )}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className="text-sm font-medium text-slate-600 hover:text-brand-700"
              >
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Cart ({cartItems.length})
            </button>
            {user ? (
              <button
                onClick={logout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}


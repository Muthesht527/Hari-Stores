import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("hari_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const persistCart = (items) => {
    setCartItems(items);
    localStorage.setItem("hari_cart", JSON.stringify(items));
  };

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.productId === product._id);
    let nextItems;

    if (existing) {
      nextItems = cartItems.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      );
    } else {
      nextItems = [
        ...cartItems,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: 1,
        },
      ];
    }

    persistCart(nextItems);
    toast.success("Added to cart");
  };

  const updateQuantity = (productId, quantity) => {
    const existing = cartItems.find((item) => item.productId === productId);
    const safeQuantity = Math.max(1, Math.min(quantity, existing?.stock || quantity));
    const nextItems = cartItems
      .map((item) =>
        item.productId === productId ? { ...item, quantity: safeQuantity } : item
      )
      .filter((item) => item.quantity > 0);
    persistCart(nextItems);
  };

  const removeFromCart = (productId) => {
    persistCart(cartItems.filter((item) => item.productId !== productId));
    toast.success("Removed from cart");
  };

  const clearCart = () => persistCart([]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-brand-700">Rs. {product.price}</p>
            <p className="text-xs text-slate-500">Stock: {product.stock}</p>
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
          >
            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        const backendUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
        setProducts(
          data.map((product) => ({
            ...product,
            image: product.image.startsWith("http") ? product.image : `${backendUrl}${product.image}`,
          }))
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 px-8 py-14 text-white shadow-soft">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-brand-100">Trusted Retail</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          Everyday shopping with enterprise reliability.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
          Discover curated products, seamless checkout, and a polished admin system built for
          modern commerce.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
          <span className="text-sm text-slate-500">{products.length} items</span>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadProductImage,
} from "../../services/productService";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";

const initialForm = {
  name: "",
  price: "",
  image: "",
  description: "",
  stock: "",
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const backendUrl = useMemo(() => import.meta.env.VITE_API_BASE_URL.replace("/api", ""), []);

  const normalizeImage = (image) =>
    image?.startsWith("http") ? image : image ? `${backendUrl}${image}` : "";

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([getProducts(), getAllOrders()]);
      setProducts(
        productsData.map((product) => ({
          ...product,
          image: normalizeImage(product.image),
        }))
      );
      setOrders(ordersData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      const data = await uploadProductImage(file);
      setProductForm((prev) => ({ ...prev, image: `${backendUrl}${data.imageUrl}` }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.image.replace(backendUrl, ""),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }

      setProductForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setProductForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      stock: product.stock,
    });
  };

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const changeOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order updated");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-2 text-3xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold">
            Rs. {orders.reduce((sum, order) => sum + order.totalAmount, 0)}
          </p>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submitProduct} className="rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{editingId ? "Edit Product" : "Add Product"}</h2>
          <div className="mt-6 space-y-4">
            <input
              value={productForm.name}
              onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Product name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
            <input
              value={productForm.price}
              onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="Price"
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
            <input
              value={productForm.stock}
              onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
              placeholder="Stock"
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Description"
              className="h-32 w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
            {uploading && <p className="text-sm text-slate-500">Uploading image...</p>}
            {productForm.image && (
              <img
                src={productForm.image}
                alt="Preview"
                className="h-32 w-full rounded-2xl object-cover"
              />
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white"
            >
              {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>

        <div className="space-y-8">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-xl font-bold">Manage Products</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <div key={product._id} className="rounded-2xl border border-slate-200 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-36 w-full rounded-xl object-cover"
                  />
                  <h3 className="mt-4 font-semibold">{product.name}</h3>
                  <p className="text-sm text-slate-500">Rs. {product.price}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => startEdit(product)}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-xl font-bold">Manage Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold">
                        {order.userId?.name || "Customer"} ({order.userId?.email || "No email"})
                      </p>
                      <p className="text-sm text-slate-500">Payment ID: {order.paymentId}</p>
                    </div>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => changeOrderStatus(order._id, e.target.value)}
                      className="rounded-xl border border-slate-300 px-3 py-2"
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                    </select>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    {order.items.map((item) => (
                      <p key={item.productId}>
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                  </div>
                  <p className="mt-4 font-bold">Total: Rs. {order.totalAmount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

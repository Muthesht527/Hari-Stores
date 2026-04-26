import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-soft">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-1 font-semibold">{user?.name || "-"}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-1 font-semibold">{user?.email || "-"}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Phone</p>
          <p className="mt-1 font-semibold">{user?.phoneNumber || "-"}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-1 font-semibold capitalize">{user?.role || "-"}</p>
        </div>
      </div>
    </div>
  );
}

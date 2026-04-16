"use client";
import AdminSidebar from "@/components/AdminSidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

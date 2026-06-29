"use client";

import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then(setCustomers)
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Customers</h1>
      <div className="card">
        <p className="text-gray-500 text-center py-8">Customer list coming soon</p>
      </div>
    </div>
  );
}

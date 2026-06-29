"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface HealthRecord {
  id: string;
  title: string;
  description: string | null;
  type: string;
  serviceDate: string | null;
  nextDueDate: string | null;
  amount: number | null;
  notes: string | null;
  createdAt: string;
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "REPAIR",
    serviceDate: "",
    nextDueDate: "",
    amount: "",
    notes: "",
  });

  const fetchRecords = () => {
    fetch("/api/health-records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    try {
      const res = await fetch("/api/health-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: form.amount ? parseFloat(form.amount) : null,
          serviceDate: form.serviceDate || null,
          nextDueDate: form.nextDueDate || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      toast.success("Record added!");
      setShowForm(false);
      setForm({ title: "", description: "", type: "REPAIR", serviceDate: "", nextDueDate: "", amount: "", notes: "" });
      fetchRecords();
    } catch {
      toast.error("Failed to create record");
    }
  };

  const recordTypes = [
    { value: "REPAIR", label: "🔧 Repair", color: "bg-blue-50 text-blue-700" },
    { value: "MAINTENANCE", label: "🔄 Maintenance", color: "bg-green-50 text-green-700" },
    { value: "INSTALLATION", label: "🛠️ Installation", color: "bg-purple-50 text-purple-700" },
    { value: "WARRANTY", label: "📜 Warranty", color: "bg-yellow-50 text-yellow-700" },
    { value: "REMINDER", label: "⏰ Reminder", color: "bg-orange-50 text-orange-700" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏥 Ghar Ka Health Record</h1>
          <p className="text-gray-600 mt-1">Track maintenance, repairs, and warranties for your home</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Add Record
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">New Record</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., AC Servicing, Water Tank Cleaning"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="flex flex-wrap gap-2">
                {recordTypes.map((rt) => (
                  <button
                    key={rt.value}
                    onClick={() => setForm({ ...form, type: rt.value })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      form.type === rt.value ? rt.color : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="input-field resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                <input
                  type="date"
                  value={form.serviceDate}
                  onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                <input
                  type="date"
                  value={form.nextDueDate}
                  onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes"
                  className="input-field"
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full">
              Save Record
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-16" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏠</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No health records yet</h3>
          <p className="text-gray-500">Track your home maintenance history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const rt = recordTypes.find((r) => r.value === record.type) || recordTypes[0];
            return (
              <div key={record.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-1 rounded-lg text-sm ${rt.color}`}>
                      {rt.label.split(" ")[0]}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.title}</h3>
                      {record.description && (
                        <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {record.serviceDate && (
                          <span>Service: {new Date(record.serviceDate).toLocaleDateString()}</span>
                        )}
                        {record.nextDueDate && (
                          <span className="text-orange-600 font-medium">
                            Next due: {new Date(record.nextDueDate).toLocaleDateString()}
                          </span>
                        )}
                        {record.amount && <span>Cost: {formatCurrency(record.amount)}</span>}
                      </div>
                      {record.notes && (
                        <p className="text-xs text-gray-400 mt-1">📝 {record.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

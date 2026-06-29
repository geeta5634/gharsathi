"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState({
    platformName: "GharSathi",
    supportEmail: "support@gharsathi.com",
    supportPhone: "+91-1800-123-4567",
  });

  const [commission, setCommission] = useState({
    plumber: 15,
    electrician: 15,
    driver: 12,
    maid: 10,
    carpenter: 15,
    housePainter: 13,
    houseCleaner: 10,
    locksmith: 18,
  });

  const [features, setFeatures] = useState({
    emergencyBooking: true,
    subscriptionPlans: true,
    healthRecords: true,
    workerReviews: true,
    chatSupport: true,
    referralProgram: false,
    promoCode: false,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    newBookingAlert: true,
    workerSignupAlert: true,
    paymentAlert: true,
    dailyDigest: false,
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    console.log("Saving settings:", { general, commission, features, notifications });
  };

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "commission", label: "Commission", icon: "💰" },
    { id: "features", label: "Features", icon: "🚀" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Settings
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="card animate-slideUp max-w-2xl">
          <h2 className="text-lg font-semibold mb-1">General Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Configure basic platform information</p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Name</label>
              <input
                type="text"
                className="input-field"
                value={general.platformName}
                onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
              <input
                type="email"
                className="input-field"
                value={general.supportEmail}
                onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Phone</label>
              <input
                type="tel"
                className="input-field"
                value={general.supportPhone}
                onChange={(e) => setGeneral({ ...general, supportPhone: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "commission" && (
        <div className="card animate-slideUp max-w-2xl">
          <h2 className="text-lg font-semibold mb-1">Commission Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Set platform commission percentage per service category</p>
          <div className="space-y-5">
            {Object.entries(commission).map(([key, value]) => {
              const labels: Record<string, string> = {
                plumber: "Plumber", electrician: "Electrician", driver: "Driver",
                maid: "Maid/Bai", carpenter: "Carpenter", housePainter: "House Painter",
                houseCleaner: "House Cleaning", locksmith: "Locksmith",
              };
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">{labels[key] || key}</label>
                    <span className="text-sm font-semibold text-blue-600">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={value}
                    onChange={(e) => setCommission({ ...commission, [key]: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "features" && (
        <div className="card animate-slideUp max-w-2xl">
          <h2 className="text-lg font-semibold mb-1">Feature Toggles</h2>
          <p className="text-sm text-gray-500 mb-6">Enable or disable platform features</p>
          <div className="space-y-4">
            {Object.entries(features).map(([key, value]) => {
              const labels: Record<string, string> = {
                emergencyBooking: "Emergency Booking",
                subscriptionPlans: "Subscription Plans",
                healthRecords: "Health Records",
                workerReviews: "Worker Reviews",
                chatSupport: "Chat Support",
                referralProgram: "Referral Program",
                promoCode: "Promo Code / Coupons",
              };
              return (
                <div key={key} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">{labels[key] || key}</span>
                  <button
                    onClick={() => setFeatures({ ...features, [key]: !value })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      value ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        value ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="card animate-slideUp max-w-2xl">
          <h2 className="text-lg font-semibold mb-1">Notification Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Configure notification channels and alerts</p>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => {
              const labels: Record<string, string> = {
                emailAlerts: "Email Alerts",
                smsAlerts: "SMS Alerts",
                newBookingAlert: "New Booking Alert",
                workerSignupAlert: "Worker Signup Alert",
                paymentAlert: "Payment Alert",
                dailyDigest: "Daily Digest Email",
              };
              const descs: Record<string, string> = {
                emailAlerts: "Receive email notifications for all alerts",
                smsAlerts: "Receive SMS notifications for critical alerts",
                newBookingAlert: "Notify when a new booking is created",
                workerSignupAlert: "Notify when a new worker registers",
                paymentAlert: "Notify when a payment is received",
                dailyDigest: "Receive a daily summary of platform activity",
              };
              return (
                <div key={key} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{labels[key] || key}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{descs[key] || ""}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      value ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        value ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

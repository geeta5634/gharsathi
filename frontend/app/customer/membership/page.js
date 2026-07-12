"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import RazorpayButton from '../../../components/RazorpayButton';
import { FaCrown, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const plans = [
  { name: 'Basic', price: 99, features: ['5 Bookings/month', 'Standard Workers', 'Phone Support', 'Basic Warranty'] },
  { name: 'Premium', price: 199, features: ['15 Bookings/month', 'Top-Rated Workers', 'Priority Support', 'Extended Warranty', '10% Discount'], popular: true },
  { name: 'VIP', price: 299, features: ['Unlimited Bookings', 'Premium Workers', '24/7 Support', 'Full Warranty', '20% Discount', 'Free Emergency Service'] },
];

export default function MembershipPage() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    api.get('/membership/current')
      .then(res => setCurrentPlan(res.data.plan || res.data))
      .catch(() => setCurrentPlan(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-header">Membership Plans</h1>

      {currentPlan && (
        <div className="card mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center gap-3">
            <FaCrown className="text-3xl text-primary-600" />
            <div>
              <h3 className="font-bold text-gray-800">Current Plan: {currentPlan.name || 'Basic'}</h3>
              <p className="text-sm text-gray-500">Valid until: {currentPlan.expiresAt ? new Date(currentPlan.expiresAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
        {plans.map((plan) => (
          <div key={plan.name} className={`card relative ${plan.popular ? 'ring-2 ring-accent-500' : ''} ${selectedPlan?.name === plan.name ? 'ring-2 ring-primary-500' : ''}`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
            <div className="mb-4"><span className="text-4xl font-bold text-primary-600">₹{plan.price}</span><span className="text-gray-500">/month</span></div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaCheckCircle className="text-green-500 text-xs" /> {f}
                </li>
              ))}
            </ul>
            {selectedPlan?.name === plan.name ? (
              <div className="mt-2">
                <RazorpayButton amount={plan.price} description={`${plan.name} Membership`} onSuccess={() => { setCurrentPlan(plan); setSelectedPlan(null); }} />
              </div>
            ) : (
              <button onClick={() => setSelectedPlan(plan)} className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-accent-500 hover:bg-accent-600 text-white' : 'btn-outline'}`}>
                {currentPlan?.name === plan.name ? 'Current Plan' : 'Choose Plan'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

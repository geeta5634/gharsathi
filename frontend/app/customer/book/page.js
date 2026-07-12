"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import WorkerCard from '@/components/WorkerCard';
import RazorpayButton from '@/components/RazorpayButton';
import { FaWrench, FaBolt, FaPaintRoller, FaBroom, FaCar, FaHammer, FaMapMarkerAlt, FaCalendar, FaClock, FaSpinner, FaExclamationTriangle, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

const serviceIcons = { Plumber: FaWrench, Electrician: FaBolt, Carpenter: FaHammer, 'House Painter': FaPaintRoller, 'House Cleaning': FaBroom, 'Driver / Maid': FaCar };
const servicePrices = { Plumber: 199, Electrician: 179, Carpenter: 249, 'House Painter': 299, 'House Cleaning': 149, 'Driver / Maid': 399 };

export default function BookService() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [form, setForm] = useState({ address: '', description: '', scheduledDate: '', scheduledTime: '', isEmergency: false });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data.services || res.data || [])).catch(() => {
      setServices([
        { name: 'Plumber', description: 'Pipe fitting, leak repair', basePrice: 199 },
        { name: 'Electrician', description: 'Wiring, switch repair', basePrice: 179 },
        { name: 'Carpenter', description: 'Furniture repair, door fitting', basePrice: 249 },
        { name: 'House Painter', description: 'Interior & exterior painting', basePrice: 299 },
        { name: 'House Cleaning', description: 'Deep cleaning services', basePrice: 149 },
        { name: 'Driver / Maid', description: 'Daily driver, part-time maid', basePrice: 399 },
      ]);
    });
  }, []);

  const selectService = async (name) => {
    setSelectedService(name);
    setStep(2);
    setLoading(true);
    try {
      const res = await api.get(`/workers?service=${name}`);
      setWorkers(res.data.workers || res.data || []);
    } catch {
      setWorkers([
        { _id: '1', name: 'Rajesh Kumar', trustScore: 85, rating: 4.7, experience: 5, services: [{ name }] },
        { _id: '2', name: 'Amit Sharma', trustScore: 72, rating: 4.3, experience: 3, services: [{ name }] },
        { _id: '3', name: 'Suresh Patel', trustScore: 91, rating: 4.9, experience: 8, services: [{ name }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectWorker = (worker) => {
    setSelectedWorker(worker);
    setStep(3);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const basePrice = servicePrices[selectedService] || 199;
  const emergencyFee = form.isEmergency ? 100 : 0;
  const gst = Math.round((basePrice + emergencyFee) * 0.18);
  const total = basePrice + emergencyFee + gst;

  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        serviceType: selectedService,
        workerId: selectedWorker?._id,
        address: form.address,
        description: form.description,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        isEmergency: form.isEmergency,
        paymentMethod,
        totalAmount: total,
      });
      setBookingResult(res.data.booking || res.data);
      if (paymentMethod === 'online') {
        setStep(5);
      } else {
        toast.success('Booking confirmed!');
        setStep(4);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-header">Book a Service</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {['Select Service', 'Choose Worker', 'Details', 'Confirm'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`text-sm whitespace-nowrap ${step === i + 1 ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>{label}</span>
            {i < 3 && <div className="w-8 h-0.5 bg-gray-200"></div>}
          </div>
        ))}
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => {
            const Icon = serviceIcons[s.name] || FaWrench;
            return (
              <div key={s.name} onClick={() => selectService(s.name)} className="card cursor-pointer hover:border-primary-300 group">
                <Icon className="text-3xl text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-800">{s.name}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
                <p className="text-primary-600 font-bold mt-2">₹{s.basePrice || servicePrices[s.name]}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Choose Worker */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-primary-600 hover:text-primary-700 text-sm mb-4">← Change Service</button>
          {loading ? (
            <div className="text-center py-12 text-gray-500"><FaSpinner className="animate-spin text-2xl mx-auto mb-2" /> Loading workers...</div>
          ) : workers.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">No workers available for this service right now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((w) => (
                <WorkerCard key={w._id} worker={w} onHire={selectWorker} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Booking Details */}
      {step === 3 && (
        <div className="max-w-2xl">
          <button onClick={() => setStep(2)} className="text-primary-600 hover:text-primary-700 text-sm mb-4">← Change Worker</button>
          <div className="card mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Selected: {selectedService}</h3>
            <p className="text-sm text-gray-500">Worker: {selectedWorker?.name}</p>
          </div>
          <div className="card space-y-4">
            <div>
              <label className="label">Address</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input name="address" value={form.address} onChange={handleChange} className="input-field pl-10" placeholder="Full address" required />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} placeholder="Describe the issue..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                  <input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} className="input-field pl-10" required />
                </div>
              </div>
              <div>
                <label className="label">Time</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-3 text-gray-400" />
                  <input type="time" name="scheduledTime" value={form.scheduledTime} onChange={handleChange} className="input-field pl-10" required />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isEmergency" checked={form.isEmergency} onChange={handleChange} className="w-4 h-4 text-accent-500 rounded" />
              <FaExclamationTriangle className="text-accent-500" />
              <span className="text-sm font-medium text-gray-700">Emergency Service (+₹100)</span>
            </label>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Base Price</span><span>₹{basePrice}</span></div>
              {form.isEmergency && <div className="flex justify-between text-sm"><span className="text-gray-600">Emergency Fee</span><span>₹{emergencyFee}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-600">GST (18%)</span><span>₹{gst}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-600">₹{total}</span></div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="label">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setPaymentMethod('cash')} className={`py-3 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500'}`}>
                  <FaMoneyBill /> Cash
                </button>
                <button type="button" onClick={() => setPaymentMethod('online')} className={`py-3 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'online' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500'}`}>
                  <FaCreditCard /> Online
                </button>
              </div>
            </div>

            <button onClick={handleBooking} disabled={loading || !form.address || !form.scheduledDate || !form.scheduledTime} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {loading ? <><FaSpinner className="animate-spin" /> Booking...</> : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="card max-w-lg text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your booking has been placed successfully. {paymentMethod === 'cash' ? 'Pay cash after service.' : 'Payment received.'}</p>
          <p className="text-sm text-gray-500 mb-4">Booking ID: {bookingResult?._id || 'N/A'}</p>
        </div>
      )}

      {/* Step 5: Online Payment */}
      {step === 5 && bookingResult && (
        <div className="card max-w-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Complete Payment</h2>
          <RazorpayButton amount={total} bookingId={bookingResult._id} description={`Booking for ${selectedService}`} onSuccess={() => { setStep(4); toast.success('Payment successful!'); }} />
        </div>
      )}
    </div>
  );
}

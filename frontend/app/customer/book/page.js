"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import WorkerCard from '@/components/WorkerCard';
import RazorpayButton from '@/components/RazorpayButton';
import { useServices, useWorkersByService, useCreateBooking } from '@/lib/hooks';
import { WorkerCardSkeleton } from '@/components/Skeletons';
import { FaWrench, FaBolt, FaBroom, FaCar, FaHammer, FaFire, FaBaby, FaHeartbeat, FaShieldAlt, FaSnowflake, FaTint, FaMagic, FaMapMarkerAlt, FaCalendar, FaClock, FaSpinner, FaExclamationTriangle, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

const serviceIcons = { Maid: FaBroom, Cook: FaFire, Driver: FaCar, 'Baby Sitter': FaBaby, 'Elder Care': FaHeartbeat, 'Security Guard': FaShieldAlt, Plumber: FaWrench, Electrician: FaBolt, Carpenter: FaHammer, 'Home Cleaning': FaMagic, 'AC Repair': FaSnowflake, 'RO Service/Repair': FaTint };
const servicePrices = { Maid: 249, Cook: 249, Driver: 249, 'Baby Sitter': 249, 'Elder Care': 249, 'Security Guard': 249, Plumber: 249, Electrician: 249, Carpenter: 249, 'Home Cleaning': 249, 'AC Repair': 249, 'RO Service/Repair': 249 };

export default function BookService() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [form, setForm] = useState({ address: '', description: '', scheduledDate: '', scheduledTime: '', isEmergency: false, city: 'City', pincode: '000000' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [bookingResult, setBookingResult] = useState(null);

  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: workers = [], isLoading: workersLoading } = useWorkersByService(selectedService?.name);
  const createBooking = useCreateBooking();

  const selectService = (svc) => {
    setSelectedService(svc);
    setStep(2);
  };

  const selectWorker = (worker) => {
    setSelectedWorker(worker);
    setStep(3);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const basePrice = selectedService?.basePrice || servicePrices[selectedService?.name] || 199;
  const emergencyFee = form.isEmergency ? 100 : 0;
  const gst = Math.round((basePrice + emergencyFee) * 0.18);
  const total = basePrice + emergencyFee + gst;

  const handleBooking = () => {
    createBooking.mutate({
      serviceId: selectedService?._id,
      worker: selectedWorker?._id,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      description: form.description,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      isEmergency: form.isEmergency,
      paymentMethod,
      totalAmount: total,
    }, {
      onSuccess: (res) => {
        setBookingResult(res);
        if (paymentMethod === 'online') {
          setStep(5);
        } else {
          toast.success('Booking confirmed!');
          setStep(4);
        }
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
    });
  };

  return (
    <div>
      <h1 className="page-header">Book a Service</h1>

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

      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => {
            const Icon = serviceIcons[s.name] || FaWrench;
            return (
              <div key={s._id || s.name} onClick={() => selectService(s)} className="card cursor-pointer hover:border-primary-300 group">
                <Icon className="text-3xl text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-800">{s.name}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
                <p className="text-primary-600 font-bold mt-2">₹{s.basePrice}</p>
              </div>
            );
          })}
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-primary-600 hover:text-primary-700 text-sm mb-4">← Change Service</button>
          {workersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <WorkerCardSkeleton key={i} />)}
            </div>
          ) : workers.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">No workers available for this service right now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map(w => (
                <WorkerCard key={w._id} worker={w} onHire={selectWorker} />
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="max-w-2xl">
          <button onClick={() => setStep(2)} className="text-primary-600 hover:text-primary-700 text-sm mb-4">← Change Worker</button>
          <div className="card mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Selected: {selectedService?.name}</h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Base Price</span><span>₹{basePrice}</span></div>
              {form.isEmergency && <div className="flex justify-between text-sm"><span className="text-gray-600">Emergency Fee</span><span>₹{emergencyFee}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-600">GST (18%)</span><span>₹{gst}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-600">₹{total}</span></div>
            </div>

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

            <button onClick={handleBooking} disabled={createBooking.isPending || !form.address || !form.scheduledDate || !form.scheduledTime} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {createBooking.isPending ? <><FaSpinner className="animate-spin" /> Booking...</> : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

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

      {step === 5 && bookingResult && (
        <div className="card max-w-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Complete Payment</h2>
          <RazorpayButton amount={total} bookingId={bookingResult._id} description={`Booking for ${selectedService?.name}`} onSuccess={() => { setStep(4); toast.success('Payment successful!'); }} />
        </div>
      )}
    </div>
  );
}

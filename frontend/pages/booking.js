import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineShieldCheck,
  HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineLocationMarker,
  HiOutlineCalendar, HiOutlineCheck, HiOutlineCreditCard,
  HiOutlinePhone, HiOutlineMail,
} from 'react-icons/hi';

const services = ['Plumber', 'Electrician', 'Driver', 'Maid', 'Carpenter', 'Painter', 'Cleaner', 'AC Repair', 'Pest Control'];
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
const paymentMethods = ['Razorpay (UPI / Card / Net Banking)', 'Cash on Service', 'Wallet (GharSathi Pay)'];

const workers = {
  'Plumber': { name: 'Rajesh Kumar', rating: 4.8, price: '₹199', jobs: 1250 },
  'Electrician': { name: 'Suresh Patel', rating: 4.9, price: '₹199', jobs: 2100 },
  'Driver': { name: 'Manoj Verma', rating: 4.8, price: '₹299/hr', jobs: 3456 },
  'Maid': { name: 'Priya Devi', rating: 4.5, price: '₹399/day', jobs: 654 },
  'Carpenter': { name: 'Amit Singh', rating: 4.6, price: '₹349', jobs: 876 },
  'Painter': { name: 'Vijay Sharma', rating: 4.7, price: '₹499', jobs: 1567 },
  'Cleaner': { name: 'Sunita Gupta', rating: 4.4, price: '₹299', jobs: 432 },
};

const pricing = {
  'Plumber': { base: 199, visit: 0, discount: 0 },
  'Electrician': { base: 199, visit: 0, discount: 0 },
  'Driver': { base: 299, visit: 0, discount: 0 },
  'Maid': { base: 399, visit: 0, discount: 0 },
  'Carpenter': { base: 349, visit: 0, discount: 0 },
  'Painter': { base: 499, visit: 0, discount: 0 },
  'Cleaner': { base: 299, visit: 0, discount: 0 },
};

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [emergency, setEmergency] = useState(false);

  const serviceData = pricing[selectedService];
  const total = serviceData ? serviceData.base + serviceData.visit - serviceData.discount : 0;

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = () => {
    setStep(5);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setAddress('');
    setPaymentMethod('');
    setPhone('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary-500 mb-6">Book a Service</h1>
          <div className="flex items-center justify-between">
            {['Service', 'Details', 'Schedule', 'Payment', 'Confirm'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 ${step > i ? 'text-accent-500' : step === i + 1 ? 'text-accent-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > i + 1 ? 'bg-green-500 text-white' :
                    step === i + 1 ? 'bg-accent-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > i + 1 ? <HiOutlineCheck className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{label}</span>
                </div>
                {i < 4 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Choose a Service</h2>
              <p className="text-gray-500 mb-6">Select the type of service you need.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSelectedService(s); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedService === s
                        ? 'border-accent-500 bg-accent-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{s}</div>
                    {pricing[s] && <div className="text-sm text-accent-500 font-semibold mt-1">₹{pricing[s].base}+</div>}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={nextStep} disabled={!selectedService} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                  Next <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Service Details</h2>
              <p className="text-gray-500 mb-6">Tell us more about what you need.</p>

              {selectedService && workers[selectedService] && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{workers[selectedService].name}</div>
                    <div className="text-sm text-gray-500">{selectedService} · ★ {workers[selectedService].rating} · {workers[selectedService].jobs}+ jobs</div>
                  </div>
                  <div className="text-accent-500 font-bold">{workers[selectedService].price}</div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Full address with landmark" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Issue (Optional)</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="E.g., Kitchen sink is leaking..." className="input-field" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} className="w-5 h-5 text-accent-500 rounded" />
                  <div>
                    <span className="font-medium">Emergency Service</span>
                    <p className="text-sm text-gray-500">Priority dispatch with 15-minute response</p>
                  </div>
                </label>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn-outline inline-flex items-center gap-2"><HiOutlineChevronLeft className="w-5 h-5" /> Back</button>
                <button onClick={nextStep} disabled={!phone || !address} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                  Next <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Schedule Service</h2>
              <p className="text-gray-500 mb-6">Choose your preferred date and time.</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-3 rounded-lg text-sm font-medium border transition-all ${
                        selectedTime === t
                          ? 'border-accent-500 bg-accent-50 text-accent-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn-outline inline-flex items-center gap-2"><HiOutlineChevronLeft className="w-5 h-5" /> Back</button>
                <button onClick={nextStep} disabled={!selectedDate || !selectedTime} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                  Next <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <p className="text-gray-500 mb-6">Choose your payment method and review pricing.</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold mb-2">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Service Charge ({selectedService})</span><span>₹{serviceData?.base}</span></div>
                  <div className="flex justify-between"><span>Visit Charge</span><span>₹{serviceData?.visit}</span></div>
                  <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-₹{serviceData?.discount}</span></div>
                  {emergency && <div className="flex justify-between"><span>Emergency Surcharge</span><span>₹99</span></div>}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-accent-500">₹{total + (emergency ? 99 : 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPaymentMethod(pm)}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                      paymentMethod === pm ? 'border-accent-500 bg-accent-50' : 'border-gray-200'
                    }`}
                  >
                    <HiOutlineCreditCard className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{pm}</span>
                    {paymentMethod === pm && <HiOutlineCheck className="w-5 h-5 text-accent-500 ml-auto" />}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn-outline inline-flex items-center gap-2"><HiOutlineChevronLeft className="w-5 h-5" /> Back</button>
                <button onClick={handleConfirm} disabled={!paymentMethod} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                  Confirm Booking <HiOutlineCheck className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineCheck className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-6">Your service has been booked successfully.</p>

              <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{selectedService}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Professional</span><span className="font-medium">{workers[selectedService]?.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="font-bold text-accent-500">₹{total + (emergency ? 99 : 0)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium">{paymentMethod}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Booking ID</span><span className="font-medium text-primary-500">#GS{Date.now().toString().slice(-8)}</span></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="btn-primary">Back to Home</Link>
                <Link href="/workers" className="btn-outline">Browse More Services</Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <HiOutlineClock className="w-4 h-4" />
                <span>You will receive an OTP confirmation on {phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

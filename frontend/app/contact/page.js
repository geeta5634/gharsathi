"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { submitContactMessage } from '@/lib/supabase/listings';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner, FaUser, FaComment } from 'react-icons/fa';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactMessage(form);
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-200">We&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have a question, feedback, or need help? Fill out the form and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Your Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field pl-10" placeholder="John Doe" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="john@email.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field pl-10" placeholder="8690094699" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <div className="relative">
                    <FaComment className="absolute left-3 top-4 text-gray-400" />
                    <textarea name="message" value={form.message} onChange={handleChange} className="input-field pl-10 min-h-[120px]" placeholder="Write your message..." required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <><FaSpinner className="animate-spin" /> Sending...</> : 'Send Message'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-xl text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Address</h3>
                    <p className="text-gray-600">106,Ganesh Nagar,Old Sardarsamand Road,Back Side Chaitanya School <br />Jhalamand,Jodhpur,Rajasthan 342013</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-xl text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 8690094699</p>
                    <p className="text-gray-500 text-sm">Mon-Sat, 9AM - 9PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-xl text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Email</h3>
                    <p className="text-gray-600">support@gharsathi.com</p>
                    <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-3">Emergency Service</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Need urgent help? Our emergency service is available 24/7.
                </p>
                <a href="tel:+91 8690094699" className="text-primary-600 font-bold text-lg hover:text-primary-700">
                  +91 8690094699
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

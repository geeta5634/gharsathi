"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import TestimonialsCarousel from '@/components/Testimonials/TestimonialsCarousel';
import { getServices, getTestimonials } from '@/lib/supabase/listings';
import { FaCheckCircle, FaCalendarCheck, FaStar, FaArrowRight, FaUsers, FaCity, FaClock, FaShieldAlt, FaBrain, FaMapMarkerAlt, FaHandshake, FaSpinner } from 'react-icons/fa';

const howItWorks = [
  { step: 1, title: 'Choose Service', description: 'Browse through our verified home services and pick what you need.', icon: FaCheckCircle },
  { step: 2, title: 'Book & Pay', description: 'Select a time slot, choose your worker, and pay securely online.', icon: FaCalendarCheck },
  { step: 3, title: 'Get It Done', description: 'Sit back while our trusted worker handles everything professionally.', icon: FaStar },
];

const plans = [
  { name: 'Basic', price: 99, features: ['5 Bookings/month', 'Standard Workers', 'Phone Support', 'Basic Warranty'], popular: false },
  { name: 'Premium', price: 199, features: ['15 Bookings/month', 'Top-Rated Workers', 'Priority Support', 'Extended Warranty', '10% Discount'], popular: true },
  { name: 'VIP', price: 299, features: ['Unlimited Bookings', 'Premium Workers', '24/7 Support', 'Full Warranty', '20% Discount', 'Free Emergency Service'], popular: false },
];

export default function HomePage() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [svc, tst] = await Promise.all([getServices(), getTestimonials()]);
        setServices(svc || []);
        setTestimonials(tst || []);
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                GharSathi ke saath, har ghar ki <span className="text-accent-400">tension khatam!</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-4 font-medium">Safe | Trusted | Verified | On Time</p>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Your one-stop solution for all home services. From plumbing to cleaning, find verified professionals you can trust.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95">
                  Book Service
                </Link>
                <Link href="/register" className="border-2 border-white text-white hover:bg-white hover:text-primary-800 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200">
                  Become a Worker
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <FaHandshake className="text-8xl text-accent-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Trusted by 10,000+ families</p>
                    <p className="text-blue-200 mt-2">Across 25+ cities</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-accent-500 text-white rounded-xl p-3 shadow-lg">
                  <FaStar className="text-2xl" />
                  <span className="text-sm font-bold">4.8</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-primary-800 rounded-xl p-3 shadow-lg">
                  <FaShieldAlt className="text-xl text-green-500" />
                  <span className="text-sm font-bold ml-1">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }}></div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Choose from a wide range of professional home services</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to get your home service done</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="text-center relative">
                {idx < 2 && <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-primary-200 z-0"></div>}
                <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 mb-6">
                  <item.icon className="text-4xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Step {item.step}: {item.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Trusted by thousands of happy families across India</p>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Membership Plans</h2>
            <p className="text-gray-600 text-lg">Choose a plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`card relative ${plan.popular ? 'ring-2 ring-accent-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-600">₹{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <FaCheckCircle className="text-green-500 text-sm" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-accent-500 hover:bg-accent-600 text-white' : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FaUsers, value: '500+', label: 'Workers' },
              { icon: FaCalendarCheck, value: '10,000+', label: 'Bookings' },
              { icon: FaStar, value: '4.8', label: 'Rating' },
              { icon: FaCity, value: '25+', label: 'Cities' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="text-4xl text-accent-400 mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Why Choose GharSathi?</h2>
            <p className="text-gray-600 text-lg">Features that make us different</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FaClock, title: '15-Min Emergency Service', desc: 'Need urgent help? Our emergency service reaches you in 15 minutes.' },
              { icon: FaShieldAlt, title: 'Worker Trust Score', desc: 'Every worker has a trust score based on verified reviews and performance.' },
              { icon: FaBrain, title: 'AI Problem Detection', desc: 'Our AI helps diagnose issues before the worker arrives for faster service.' },
              { icon: FaMapMarkerAlt, title: 'Neighborhood Network', desc: 'Find trusted workers from your own neighborhood for reliable service.' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center p-6 rounded-xl hover:bg-primary-50 transition-all duration-300">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-2xl text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-orange-100 mb-8">Join thousands of happy customers and skilled workers on GharSathi</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-white text-accent-600 hover:bg-orange-50 font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg">
              Sign Up Now <FaArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

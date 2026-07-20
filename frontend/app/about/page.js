"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaShieldAlt, FaStar, FaUsers, FaCity, FaHandshake, FaClock } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About GharSathi</h1>
          <p className="text-xl text-blue-200">Safe | Trusted | Verified | On Time</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Har Ghar Ki Tension Khatam!</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                GharSathi is India&apos;s fastest-growing home services marketplace, connecting millions of families with trusted,
                verified, and skilled professionals for all their home service needs.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2023, we have served over 10,000 families across 25+ cities, providing services ranging from plumbing
                and electrical work to deep cleaning and carpentry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to make home services accessible, affordable, and reliable for every Indian household.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FaUsers, value: '500+', label: 'Workers' },
                { icon: FaStar, value: '4.8', label: 'Rating' },
                { icon: FaCity, value: '25+', label: 'Cities' },
                { icon: FaHandshake, value: '10K+', label: 'Families' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6 text-center">
                    <Icon className="text-3xl text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Values</h2>
            <p className="text-gray-600 text-lg">What drives us every day</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FaShieldAlt, title: 'Trust & Safety', desc: 'Every worker is verified with background checks. Your safety is our top priority.' },
              { icon: FaStar, title: 'Quality Service', desc: 'We maintain high standards through our trust score system and customer reviews.' },
              { icon: FaClock, title: 'On-Time Guarantee', desc: 'We respect your time. Our workers arrive on time, every time.' },
            ].map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="card text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{v.title}</h3>
                  <p className="text-gray-600">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Leadership</h2>
          <p className="text-gray-600 text-lg mb-14">Meet the team behind GharSathi</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Virendra Singh Rathore', role: 'CEO & Founder', bio: '15+ years in home services industry' },
              { name: 'Virendra Singh Rathore', role: 'CTO', bio: 'Tech leader with passion for innovation' },
              { name: 'Amit Patel', role: 'COO', bio: 'Operations expert scaling businesses' },
            ].map((member, idx) => (
              <div key={idx} className="card">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-600">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                <p className="text-primary-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

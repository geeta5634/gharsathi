"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SERVICE_CATEGORIES } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold">
      {count}
      {suffix}
    </div>
  );
}

function FloatingIcon({ icon, className }: { icon: string; className: string }) {
  return (
    <div className={`absolute text-3xl md:text-4xl animate-float opacity-20 ${className}`}>
      {icon}
    </div>
  );
}

const testimonials = [
  { name: "Priya Sharma", role: "Homeowner", text: "Booked a plumber through GharSathi and he arrived within 30 minutes. Fixed the leak perfectly. Highly recommend!", rating: 5, avatar: "PS" },
  { name: "Rahul Verma", role: "Rental Owner", text: "I manage 5 properties and use GharSathi for all maintenance. The subscription plans save me a lot of money every month.", rating: 5, avatar: "RV" },
  { name: "Anita Gupta", role: "Working Professional", text: "The AI detection feature is amazing! I uploaded a photo of my electrical issue and it correctly identified I needed an electrician.", rating: 5, avatar: "AG" },
  { name: "Vikram Singh", role: "Homemaker", text: "Started with a cleaner, now use for everything - plumbing, electrical, even painting. Great quality workers every time.", rating: 5, avatar: "VS" },
];

const stats = [
  { label: "Happy Customers", end: 15000, suffix: "+", icon: "😊" },
  { label: "Trusted Workers", end: 500, suffix: "+", icon: "🔧" },
  { label: "Cities Covered", end: 50, suffix: "+", icon: "🏙️" },
  { label: "Average Rating", end: 49, suffix: ".9★" },
];

const steps = [
  { icon: "📱", title: "Describe Your Issue", desc: "Tell us what you need fixed or upload a photo for AI detection." },
  { icon: "🔍", title: "Find the Right Pro", desc: "Browse trusted workers with ratings, reviews, and transparent pricing." },
  { icon: "📅", title: "Book Instantly", desc: "Choose a time that works for you and confirm your booking in seconds." },
  { icon: "✅", title: "Get It Done", desc: "Relax while our verified professional arrives and gets the job done." },
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploadDrag, setUploadDrag] = useState(false);

  const handleServiceClick = (category: string) => {
    if (!session) {
      router.push("/login");
    } else {
      router.push(`/customer/workers?category=${category}`);
    }
  };

  const dashboardHref = session?.user?.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Navigation */}
      <header className="glass border-b border-white/20 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gradient">GharSathi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="nav-link text-gray-700 active">Home</Link>
            <Link href="/customer/workers" className="nav-link text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/customer/workers?emergency=true" className="nav-link text-red-500 hover:text-red-700">Emergency</Link>
            <Link href="/customer/subscription" className="nav-link text-gray-600 hover:text-gray-900">Plans</Link>
          </nav>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">{session.user.name || session.user.phone}</span>
                <Link href={dashboardHref} className="btn-primary text-sm">Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm hidden sm:inline-flex">Login</Link>
                <Link href="/register" className="btn-gradient text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pb-16 pt-8 md:pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />

          {/* Floating decorative elements */}
          <FloatingIcon icon="🔧" className="top-20 left-[10%] animate-float" />
          <FloatingIcon icon="⚡" className="top-40 right-[15%] animate-float stagger-1" />
          <FloatingIcon icon="🧹" className="bottom-32 left-[20%] animate-float stagger-2" />
          <FloatingIcon icon="🔐" className="bottom-20 right-[10%] animate-float stagger-3" />
          <FloatingIcon icon="🚗" className="top-60 left-[5%] animate-float stagger-4" />
          <FloatingIcon icon="🎨" className="bottom-40 right-[5%] animate-float stagger-5" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float stagger-2" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fadeIn`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white font-medium">Trusted by 15,000+ customers across 50+ cities</span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-slideUp`}>
                Home Services{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  On Demand
                </span>
              </h1>
              <p className={`text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 animate-fadeIn stagger-2`}>
                From plumbing to painting, find verified professionals near you. Book in seconds, get service today.
              </p>
              <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-slideUp stagger-3`}>
                <Link
                  href={session ? "/customer/workers" : "/register"}
                  className="btn-gradient text-lg px-8 py-3.5 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50"
                >
                  {session ? "Find Services" : "Get Started Free"}
                </Link>
                <Link
                  href="/customer/workers"
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl font-medium hover:bg-white/30 transition-all duration-200"
                >
                  Browse Services
                </Link>
              </div>
              <div className={`flex items-center justify-center gap-4 md:gap-8 text-white/80 text-sm animate-fadeIn stagger-4`}>
                <div className="flex items-center gap-1">
                  <span>✅</span> Verified Workers
                </div>
                <div className="flex items-center gap-1">
                  <span>💰</span> Transparent Pricing
                </div>
                <div className="flex items-center gap-1">
                  <span>🔒</span> Secure Booking
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="py-12 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
              {stats.map((stat, i) => (
                <div key={stat.label} className={`animate-slideUp stagger-${i + 1}`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our <span className="text-gradient">Services</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Choose from a wide range of professional home services at your fingertips
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {SERVICE_CATEGORIES.map((service, i) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className={`card card-hover text-center p-6 md:p-8 group animate-slideUp stagger-${(i % 5) + 1}`}
                >
                  <div className={`w-14 h-14 mx-auto ${service.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">Book Now →</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Banner */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-2xl p-8 md:p-10 text-white overflow-hidden animate-gradient">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="text-5xl">🚨</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold">Emergency Service Available 24/7</h3>
                    <p className="text-orange-100 mt-1">Response within 15 minutes for urgent plumbing, electrical & locksmith needs</p>
                  </div>
                </div>
                <Link
                  href={session ? "/customer/workers?emergency=true" : "/login"}
                  className="shrink-0 bg-white text-red-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-red-50 transition-colors animate-pulse"
                >
                  Request Emergency
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It <span className="text-gradient">Works</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">Get your home service in four simple steps</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.title} className={`card text-center p-6 animate-slideUp stagger-${(i % 5) + 1}`}>
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <div className="absolute inset-0 bg-blue-100 rounded-2xl animate-float" style={{ animationDelay: `${i * 0.3}s` }} />
                    <div className="relative w-full h-full flex items-center justify-center text-2xl">{step.icon}</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Problem Detection */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-8 md:p-10 shadow-xl border border-white/50">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                    🤖 AI Powered
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Not Sure What Service You Need?
                  </h2>
                  <p className="text-gray-600">
                    Upload a photo of the problem and our AI will detect the issue and recommend the right professional
                  </p>
                </div>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 ${
                    uploadDrag
                      ? "border-blue-500 bg-blue-50 scale-[1.02]"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setUploadDrag(true); }}
                  onDragLeave={() => setUploadDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setUploadDrag(false); }}
                  onClick={() => document.getElementById("ai-upload")?.click()}
                >
                  <input id="ai-upload" type="file" accept="image/*" className="hidden" />
                  <div className={`text-6xl mb-4 transition-transform duration-300 ${uploadDrag ? "scale-110" : ""}`}>
                    {uploadDrag ? "📸" : "🔍"}
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    {uploadDrag ? "Drop your photo here" : "Tap to upload a photo"}
                  </p>
                  <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP • Max 10MB</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">Leaking pipe</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">Broken switch</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Cracked wall</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Clogged drain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our <span className="text-gradient">Customers</span> Say
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">Trusted by thousands of happy customers across India</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t, i) => (
                <div key={t.name} className={`card animate-slideUp stagger-${(i % 5) + 1}`}>
                  <div className="flex items-center gap-1 text-yellow-400 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Stats / CTA Banner */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of happy customers. Book your first service today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={session ? "/customer/workers" : "/register"}
                  className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
                >
                  {session ? "Book a Service" : "Sign Up Free"}
                </Link>
                <Link
                  href="/customer/workers"
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl font-medium hover:bg-white/30 transition-all"
                >
                  Explore Services
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/80 text-sm">
                <div className="flex items-center gap-2">🔒 <span>Secure Payments</span></div>
                <div className="flex items-center gap-2">✅ <span>Verified Professionals</span></div>
                <div className="flex items-center gap-2">💰 <span>Money-Back Guarantee</span></div>
                <div className="flex items-center gap-2">📞 <span>24/7 Customer Support</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏠</span>
                <span className="text-xl font-bold text-white">GharSathi</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                India&apos;s most trusted home services platform. We connect you with verified professionals for all your home needs.
              </p>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">📘</span>
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">📸</span>
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">🐦</span>
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">💼</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                {SERVICE_CATEGORIES.slice(0, 6).map((s) => (
                  <li key={s.id}>
                    <Link href={`/customer/workers?category=${s.id}`} className="hover:text-white transition-colors">
                      {s.icon} {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/customer/workers" className="text-blue-400 hover:text-blue-300 transition-colors text-xs">
                    View All Services →
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
                <li><Link href="/customer/subscription" className="hover:text-white transition-colors">Membership Plans</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="text-gray-500">contact@gharsathi.in</span></li>
                <li><span className="text-gray-500">+91 98765 43210</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} GharSathi. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function TestimonialsCarousel({ testimonials = [] }) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No testimonials yet.
      </div>
    );
  }

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <FaQuoteLeft className="text-4xl text-primary-200 mx-auto mb-6" />
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 italic">
          &ldquo;{t.content}&rdquo;
        </p>
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={`${i < (t.rating || 5) ? 'text-accent-400' : 'text-gray-200'}`} />
          ))}
        </div>
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-primary-600">
            {t.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <h4 className="font-bold text-gray-800 text-lg">{t.name}</h4>
        <p className="text-gray-500 text-sm">{t.role || 'Verified Customer'}</p>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-all hover:shadow-xl"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-all hover:shadow-xl"
      >
        <FaChevronRight />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}

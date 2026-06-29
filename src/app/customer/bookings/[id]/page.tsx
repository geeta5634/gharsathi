"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import BookingTimeline from "@/components/shared/BookingTimeline";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null; role: string };
}

interface BookingDetail {
  id: string;
  bookingId: string;
  status: string;
  scheduledDate: string;
  timeSlot: string;
  address: string;
  finalAmount: number;
  visitCharge: number;
  serviceCharge: number;
  discountAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  problemDescription: string | null;
  service: { name: string; icon: string | null };
  customer: { id: string; name: string | null; phone: string };
  worker: { id: string; name: string | null; phone: string } | null;
  review: { rating: number; comment: string | null } | null;
  statusHistory: { status: string; note: string | null; createdAt: string }[];
  messages: Message[];
}

const GRADIENTS = [
  "from-blue-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-rose-500 to-red-600",
  "from-violet-500 to-fuchsia-600",
];

function getGradient(name: string) {
  const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[index % GRADIENTS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function BookingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card shimmer !h-40 rounded-xl" />
        ))}
      </div>
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="card shimmer !h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchBooking = () => {
    fetch(`/api/bookings/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [booking?.messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: params.id, content: newMessage }),
      });
      if (!res.ok) throw new Error("Failed");
      setNewMessage("");
      fetchBooking();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <BookingSkeleton />;

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-3xl mb-4">
          &#x2716;
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h3>
        <p className="text-gray-500 mb-6">This booking doesn&apos;t exist or has been removed.</p>
        <a href="/customer/bookings" className="btn-primary">Back to Bookings</a>
      </div>
    );
  }

  const isChatVisible = booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
  const workerGradient = booking.worker?.name ? getGradient(booking.worker.name) : "from-gray-400 to-gray-500";

  return (
    <div className="animate-fadeIn">
      <div className="mb-2">
        <a
          href="/customer/bookings"
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to bookings
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service info header */}
          <div className="animate-slideUp stagger-1">
            <div className="card overflow-hidden">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
                    {booking.service.icon || "🔧"}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{booking.service.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Booking ID: <span className="font-mono font-medium text-gray-700">{booking.bookingId}</span>
                    </p>
                  </div>
                </div>
                <span className={`badge text-sm px-4 py-1.5 ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>

              <BookingTimeline currentStatus={booking.status} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 pt-5 border-t border-gray-100">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Time</p>
                  <p className="font-semibold text-gray-900">{booking.timeSlot}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="font-semibold text-gray-900">{booking.address}</p>
                </div>
                {booking.problemDescription && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Issue Description</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-900">{booking.problemDescription}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Worker info */}
          {booking.worker && (
            <div className="animate-slideUp stagger-2">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">&#9881;</span>
                  Assigned Worker
                </h2>
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${workerGradient} flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0`}
                  >
                    {getInitials(booking.worker.name || "Worker")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {booking.worker.name || "Worker"}
                    </p>
                    <a
                      href={`tel:${booking.worker.phone}`}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {booking.worker.phone}
                    </a>
                    <div className="flex items-center gap-3 mt-3">
                      <a
                        href={`tel:${booking.worker.phone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </a>
                      <button
                        onClick={() => {
                          const chatEl = document.getElementById("live-chat");
                          chatEl?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-all active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Chat */}
          {isChatVisible && (
            <div id="live-chat" className="animate-slideUp stagger-3">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">&#9993;</span>
                  Live Chat
                </h2>
                <div
                  ref={chatContainerRef}
                  className="h-72 overflow-y-auto mb-4 space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50 scroll-smooth"
                >
                  {booking.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3">
                        &#128172;
                      </div>
                      <p className="text-gray-400 text-sm font-medium">No messages yet</p>
                      <p className="text-gray-400 text-xs mt-1">Send a message to start chatting</p>
                    </div>
                  ) : (
                    booking.messages.map((msg) => {
                      const isMine = msg.sender.id === session?.user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fadeIn`}
                        >
                          <div className="flex items-end gap-2 max-w-[80%]">
                            {!isMine && (
                              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getGradient(msg.sender.name || "Support")} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                {getInitials(msg.sender.name || "S")}
                              </div>
                            )}
                            <div
                              className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isMine
                                  ? "bg-blue-600 text-white rounded-br-md"
                                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p
                                className={`text-[11px] mt-1 ${
                                  isMine ? "text-blue-200" : "text-gray-400"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="input-field flex-1"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary !px-6 flex items-center gap-2"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Review */}
          {booking.status === "COMPLETED" && !booking.review && (
            <div className="animate-slideUp stagger-4">
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shrink-0">
                    &#9733;
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Rate This Service</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      How was your experience with {booking.service.name}? Your feedback helps us improve.
                    </p>
                    <button className="btn-gradient inline-flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Write a Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {booking.review && (
            <div className="animate-slideUp stagger-4">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-amber-400">&#9733;</span>
                  Your Review
                </h2>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= booking.review!.rating ? "text-amber-400" : "text-gray-200"
                      }`}
                    >
                      &#9733;
                    </span>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{booking.review!.rating}/5</span>
                </div>
                {booking.review.comment && (
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{booking.review.comment}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Payment Details */}
          <div className="animate-slideUp stagger-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">&#8377;</span>
                Payment Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500">Visit Charge</span>
                  <span className="font-medium text-gray-900">{formatCurrency(booking.visitCharge)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500">Service Charge</span>
                  <span className="font-medium text-gray-900">{formatCurrency(booking.serviceCharge)}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-emerald-600">-{formatCurrency(booking.discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(booking.finalAmount)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 capitalize">
                    {booking.paymentMethod === "ONLINE" ? (
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {booking.paymentMethod.replace("_", " ").toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Payment Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${
                      booking.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700"
                        : booking.paymentStatus === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        booking.paymentStatus === "PAID"
                          ? "bg-emerald-500"
                          : booking.paymentStatus === "PENDING"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                    {booking.paymentStatus === "PAID" ? "Paid" : booking.paymentStatus === "PENDING" ? "Pending" : "Failed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="animate-slideUp stagger-3">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">&#8986;</span>
                Status History
              </h2>
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />
                <div className="space-y-5">
                  {booking.statusHistory.map((h, i) => (
                    <div key={h.createdAt} className="relative flex items-start gap-4 animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 z-10 ${
                          i === 0
                            ? "bg-blue-500 border-blue-500 shadow-md"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {i === 0 && (
                          <span className="absolute -inset-1.5 rounded-full bg-blue-500/20 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 -mt-0.5">
                        <p className="text-sm font-semibold text-gray-900">{getStatusLabel(h.status)}</p>
                        {h.note && (
                          <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(h.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(h.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

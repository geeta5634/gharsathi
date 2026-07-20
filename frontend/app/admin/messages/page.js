"use client";

import { useState, useEffect } from 'react';
import { FaEnvelope, FaSpinner, FaEnvelopeOpen, FaUser, FaPhone } from 'react-icons/fa';
import { getContactMessages, markMessageRead } from '@/lib/supabase/listings';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data || []);
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      toast.success('Marked as read');
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-600" /></div>;
  }

  return (
    <div>
      <h1 className="page-header">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map(m => {
            const mid = m._id || m.id;
            return (
            <div key={mid} className={`card ${!m.is_read ? 'ring-2 ring-primary-200 bg-primary-50/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FaUser className="text-primary-600 text-sm" /> {m.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <FaEnvelope className="text-gray-400" /> {m.email}
                    {m.phone && <><FaPhone className="text-gray-400 ml-2" /> {m.phone}</>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{new Date(m.created_at || m.createdAt).toLocaleString()}</span>
                  {!m.is_read && (
                    <button onClick={() => handleMarkRead(mid)} className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1" title="Mark as read">
                      <FaEnvelopeOpen /> Mark Read
                    </button>
                  )}
                </div>
              </div>
              {m.subject && <p className="text-sm font-medium text-gray-700 mb-1">Subject: {m.subject}</p>}
              <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{m.message}</p>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

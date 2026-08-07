import React, { useState } from 'react';
import { Send, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Artist Submission');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      addToast('Message sent! Our support team will respond within 24 hours.', 'success');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 pb-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Contact & Support</h1>
        <p className="text-slate-400 text-sm">
          Have questions, feedback, or want to submit your artwork as an official creator?
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-700 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-sky-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Message Received</h3>
          <p className="text-sm text-slate-300">
            Thank you for reaching out to Wallpaper Station. A member of our team will be in touch shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-semibold text-sky-400 border border-slate-800"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-slate-700 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Your Name</label>
            <input
              type="text"
              required
              placeholder="Alex Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Topic</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="Artist Submission">Artist Artwork Submission</option>
              <option value="Bug Report">Technical Issue or Bug Report</option>
              <option value="Copyright DMCA">Copyright / DMCA Takedown</option>
              <option value="Partnership">Commercial Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Message</label>
            <textarea
              rows={4}
              required
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
};

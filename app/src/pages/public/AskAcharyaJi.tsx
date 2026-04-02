import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import client from '@/api/client';

export function AskAcharyaJi() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', question: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.question) {
      setError('Please fill in your name, email, and question.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await client.post('/contact', formData);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
        <div className="px-6 lg:px-[6vw] flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-[#111827] mb-4">
              Thank you for reaching out!
            </h2>
            <p className="text-[#6B7280] text-base leading-relaxed">
              Your question has been submitted. We will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-semibold text-[#111827] mb-4">
              Ask Acharya Ji
            </h1>
            <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed">
              Have a question about spirituality, meditation, or your personal journey? Submit your question below and Acharya Navneetji or the team will respond.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-[22px] card-shadow-light p-6 lg:p-8 space-y-5">
            <div>
              <label className="text-sm text-[#374151] mb-1 block">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-[#E5E7EB]"
                placeholder="Your name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-[#374151] mb-1 block">Your Question *</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent resize-none"
                rows={6}
                placeholder="Write your question here..."
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full py-5 text-sm font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Sending...' : 'Submit Question'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

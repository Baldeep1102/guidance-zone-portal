import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/api/auth';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[28px] card-shadow-light p-8 lg:p-12">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-3">Check your email</h1>
              <p className="text-[#6B7280] text-sm mb-2">
                If an account with <strong>{email}</strong> exists, a password reset link has been sent.
              </p>
              <p className="text-[#9CA3AF] text-xs mb-8">
                Don't see it? Check your spam or junk folder.
              </p>
              <Link to="/login">
                <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl px-8">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6">
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>
                <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">Forgot password?</h1>
                <p className="text-[#6B7280] text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="pl-10 rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl py-5"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

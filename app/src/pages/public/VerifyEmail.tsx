import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/api/auth';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    authApi.verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
      });
  }, [searchParams]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    setResendStatus('idle');
    try {
      await authApi.resendVerification(resendEmail);
      setResendStatus('success');
      setResendMessage('Verification email sent! Check your inbox and spam folder.');
    } catch (err: any) {
      setResendStatus('error');
      setResendMessage(err.response?.data?.error || 'Failed to resend. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md space-y-4">
        <div className="bg-white rounded-[28px] card-shadow-light p-8 lg:p-12 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-[#7B6CFF] mx-auto mb-4 animate-spin" />
              <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">
                Verifying your email...
              </h1>
              <p className="text-[#6B7280] text-sm">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">
                Email Verified!
              </h1>
              <p className="text-[#6B7280] text-sm mb-8">{message}</p>
              <Link to="/login">
                <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl px-8">
                  Sign In
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">
                Verification Failed
              </h1>
              <p className="text-[#6B7280] text-sm mb-8">{message}</p>
              <Link to="/login">
                <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl px-8">
                  Go to Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Resend section — always visible */}
        <div className="bg-white rounded-[22px] card-shadow-light p-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-[#7B6CFF]" />
            <h2 className="font-medium text-[#111827] text-sm">Didn't receive the email?</h2>
          </div>
          <p className="text-xs text-[#6B7280] mb-4">
            Check your <strong>spam or junk folder</strong> first. If it's not there, enter your email to resend.
          </p>
          <form onSubmit={handleResend} className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              className="flex-1 rounded-xl border-[#E5E7EB] text-sm"
            />
            <Button
              type="submit"
              disabled={resendLoading}
              className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl px-4 text-sm"
            >
              {resendLoading ? '...' : 'Resend'}
            </Button>
          </form>
          {resendStatus === 'success' && (
            <p className="text-green-600 text-xs mt-2">{resendMessage}</p>
          )}
          {resendStatus === 'error' && (
            <p className="text-red-500 text-xs mt-2">{resendMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

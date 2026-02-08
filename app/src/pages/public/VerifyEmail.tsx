import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

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

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
}

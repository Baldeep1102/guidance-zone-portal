import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup({ name, email, password, phone: phone || undefined });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] grain-overlay flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[28px] card-shadow-light p-8 lg:p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">
              Check your email
            </h1>
            <p className="text-[#6B7280] text-sm mb-8">
              We've sent a verification link to <strong>{email}</strong>. Please verify your email to activate your account.
            </p>
            <Link to="/login">
              <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl px-8">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay flex items-center justify-center p-4 pt-24 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[28px] card-shadow-light p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-[#7B6CFF]" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">
              Join Guidance Zone
            </h1>
            <p className="text-[#6B7280] text-sm">
              Create your account to start your spiritual journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-[#374151] mb-1 block">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-[#E5E7EB]"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#374151] mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-[#E5E7EB]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#374151] mb-1 block">Phone (optional)</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-[#E5E7EB]"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="text-sm text-[#374151] mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[#E5E7EB] pr-12"
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-[#374151] mb-1 block">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-[#E5E7EB]"
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl py-3 font-medium"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7B6CFF] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

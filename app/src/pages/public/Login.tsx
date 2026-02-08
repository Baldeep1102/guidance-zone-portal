import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[28px] card-shadow-light p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#7B6CFF]" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-[#111827] mb-2">
              Welcome back
            </h1>
            <p className="text-[#6B7280] text-sm">
              Sign in to access your courses and dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-[#374151] mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-[#E5E7EB] px-4 py-3 focus:ring-2 focus:ring-[#7B6CFF]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#374151] mb-2 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[#E5E7EB] px-4 py-3 pr-12 focus:ring-2 focus:ring-[#7B6CFF]"
                  placeholder="Enter your password"
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

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-[#7B6CFF] hover:underline">
                Forgot password?
              </Link>
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
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#7B6CFF] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function AdminLogin() {
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
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1C] flex items-center justify-center p-4">
      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[rgba(16,20,34,0.9)] border border-[rgba(255,255,255,0.08)] rounded-[28px] p-8 lg:p-12 card-shadow-dark">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#7B6CFF]/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#7B6CFF]" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-[rgba(255,255,255,0.6)] text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-[rgba(255,255,255,0.7)] mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7B6CFF]"
                placeholder="admin@guzo.org"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[rgba(255,255,255,0.7)] mb-2 block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#7B6CFF]"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-xl py-3 font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

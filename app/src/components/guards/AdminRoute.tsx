import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F1C]">
        <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { AdminRoute } from '@/components/guards/AdminRoute';

// Public Pages
import { Home } from '@/pages/public/Home';
import { Talks } from '@/pages/public/Talks';
import { Books } from '@/pages/public/Books';
import { About } from '@/pages/public/About';
import { Courses } from '@/pages/public/Courses';
import { Dashboard } from '@/pages/public/Dashboard';
import { Downloads } from '@/pages/public/Downloads';
import { Projects } from '@/pages/public/Projects';
import { Login } from '@/pages/public/Login';
import { Signup } from '@/pages/public/Signup';
import { VerifyEmail } from '@/pages/public/VerifyEmail';

// Admin Pages
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminCourses } from '@/pages/admin/AdminCourses';
import { AdminTalks } from '@/pages/admin/AdminTalks';
import { AdminBooks } from '@/pages/admin/AdminBooks';
import { AdminRegistrations } from '@/pages/admin/AdminRegistrations';
import { AdminDownloads } from '@/pages/admin/AdminDownloads';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminSettings } from '@/pages/admin/AdminSettings';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public Layout with Navbar and Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// Admin Layout with Navbar only
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar isAdmin />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/talks" element={<PublicLayout><Talks /></PublicLayout>} />
          <Route path="/books" element={<PublicLayout><Books /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
          <Route path="/downloads" element={<PublicLayout><Downloads /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
          <Route path="/verify-email" element={<PublicLayout><VerifyEmail /></PublicLayout>} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <PublicLayout>
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              </PublicLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><AdminLayout><AdminCourses /></AdminLayout></AdminRoute>} />
          <Route path="/admin/talks" element={<AdminRoute><AdminLayout><AdminTalks /></AdminLayout></AdminRoute>} />
          <Route path="/admin/books" element={<AdminRoute><AdminLayout><AdminBooks /></AdminLayout></AdminRoute>} />
          <Route path="/admin/registrations" element={<AdminRoute><AdminLayout><AdminRegistrations /></AdminLayout></AdminRoute>} />
          <Route path="/admin/downloads" element={<AdminRoute><AdminLayout><AdminDownloads /></AdminLayout></AdminRoute>} />
          <Route path="/admin/projects" element={<AdminRoute><AdminLayout><AdminProjects /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

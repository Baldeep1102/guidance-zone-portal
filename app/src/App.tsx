import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { AdminRoute } from '@/components/guards/AdminRoute';
import client from '@/api/client';
import type { SiteSettings } from '@/types';

// Public Pages
import { Home } from '@/pages/public/Home';
import { Talks } from '@/pages/public/Talks';
import { Books } from '@/pages/public/Books';
import { About } from '@/pages/public/About';
import { Courses } from '@/pages/public/Courses';
import { Dashboard } from '@/pages/public/Dashboard';
import { Downloads } from '@/pages/public/Downloads';
import { Projects } from '@/pages/public/Projects';
import { AskAcharyaJi } from '@/pages/public/AskAcharyaJi';
import { FAQ } from '@/pages/public/FAQ';
import { Terms } from '@/pages/public/Terms';
import { Privacy } from '@/pages/public/Privacy';
import { Login } from '@/pages/public/Login';
import { Signup } from '@/pages/public/Signup';
import { VerifyEmail } from '@/pages/public/VerifyEmail';
import { ForgotPassword } from '@/pages/public/ForgotPassword';
import { ResetPassword } from '@/pages/public/ResetPassword';

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

// Slightly darken a hex color for hover states
function darkenHex(hex: string, amount = 0.1): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (n >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Loads site settings once: injects theme overrides + renders announcement banner
function SiteSettingsLoader() {
  const [banner, setBanner] = useState('');

  useEffect(() => {
    client.get<SiteSettings>('/settings').then((res) => {
      const s = res.data;

      // Announcement banner
      setBanner(s.announcementBanner || '');
      // Store banner presence as CSS variable so Navbar can offset its top
      document.documentElement.style.setProperty('--announcement-h', s.announcementBanner ? '36px' : '0px');

      // Theme — inject a <style> tag that overrides Tailwind's hardcoded accent classes
      const accent = s.colorScheme?.accent || '#7B6CFF';
      const accentHover = darkenHex(accent, 0.08);

      let styleEl = document.getElementById('guzo-theme') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'guzo-theme';
        document.head.appendChild(styleEl);
      }
      // Target Tailwind's escaped arbitrary-value class names
      styleEl.textContent = `
        .bg-\\[\\#7B6CFF\\] { background-color: ${accent} !important; }
        .hover\\:bg-\\[\\#6B5CFF\\]:hover { background-color: ${accentHover} !important; }
        .hover\\:bg-\\[\\#7B6CFF\\]:hover { background-color: ${accentHover} !important; }
        .text-\\[\\#7B6CFF\\] { color: ${accent} !important; }
        .border-\\[\\#7B6CFF\\] { border-color: ${accent} !important; }
        .ring-\\[\\#7B6CFF\\] { --tw-ring-color: ${accent} !important; }
        .focus\\:ring-\\[\\#7B6CFF\\]:focus { --tw-ring-color: ${accent} !important; }
        .focus\\:border-\\[\\#7B6CFF\\]:focus { border-color: ${accent} !important; }
      `;
    }).catch(() => {});
  }, []);

  if (!banner) return null;

  return (
    <div
      style={{ height: '36px' }}
      className="fixed top-0 left-0 right-0 z-[70] bg-[#7B6CFF] text-white text-center text-sm flex items-center justify-center px-4"
    >
      {banner}
    </div>
  );
}

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
        <SiteSettingsLoader />
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
          <Route path="/ask-acharya-ji" element={<PublicLayout><AskAcharyaJi /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
          <Route path="/verify-email" element={<PublicLayout><VerifyEmail /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
          <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />

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

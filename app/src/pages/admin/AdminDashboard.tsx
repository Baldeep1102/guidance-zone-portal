import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Video, Library, TrendingUp, ArrowRight, Download, FolderKanban, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';
import { adminApi } from '@/api/admin';
import type { DashboardStats } from '@/types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, loading, error } = useApi<DashboardStats>(adminApi.getStats);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-blue-500', path: '/admin/registrations' },
    { label: 'Courses', value: stats?.totalCourses ?? 0, icon: BookOpen, color: 'bg-green-500', path: '/admin/courses' },
    { label: 'Talks', value: stats?.totalTalks ?? 0, icon: Video, color: 'bg-purple-500', path: '/admin/talks' },
    { label: 'Books', value: stats?.totalBooks ?? 0, icon: Library, color: 'bg-orange-500', path: '/admin/books' },
    { label: 'Downloads', value: stats?.totalDownloads ?? 0, icon: Download, color: 'bg-cyan-500', path: '/admin/downloads' },
    { label: 'Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, color: 'bg-pink-500', path: '/admin/projects' },
  ];

  const quickActions = [
    { label: 'Add New Course', path: '/admin/courses', description: 'Create a new course' },
    { label: 'Add New Talk', path: '/admin/talks', description: 'Upload a new teaching' },
    { label: 'Add New Book', path: '/admin/books', description: 'Add a book to the library' },
    { label: 'View Registrations', path: '/admin/registrations', description: 'See all registrations' },
    { label: 'Manage Downloads', path: '/admin/downloads', description: 'Add or update downloadable resources' },
    { label: 'Manage Projects', path: '/admin/projects', description: 'Update project information' },
    { label: 'Manage Users', path: '/admin/users', description: 'View and manage user accounts' },
    { label: 'Site Settings', path: '/admin/settings', description: 'Configure site-wide settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
            Admin Panel
          </span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">
            Dashboard
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280]">Loading dashboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-8">
            Failed to load dashboard stats: {error}
          </div>
        )}

        {/* Stats Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-10">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  onClick={() => navigate(stat.path)}
                  className="bg-white rounded-[22px] card-shadow-light p-6 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl ${stat.color}/10 flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="font-heading text-3xl font-semibold text-[#111827] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#6B7280]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <h2 className="font-heading text-lg font-semibold text-[#111827] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="bg-white rounded-[22px] card-shadow-light p-6 cursor-pointer hover:shadow-lg transition-shadow group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-[#111827] group-hover:text-[#7B6CFF] transition-colors">
                          {action.label}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#7B6CFF] transition-colors" />
                      </div>
                      <p className="text-sm text-[#6B7280]">{action.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Registrations */}
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#111827] mb-4">Recent Registrations</h2>
                <div className="bg-white rounded-[22px] card-shadow-light p-6">
                  {!stats?.recentRegistrations?.length ? (
                    <p className="text-[#6B7280] text-sm text-center py-8">No registrations yet</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentRegistrations.slice(0, 5).map((reg) => (
                        <div key={reg.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0 border-[#F3F4F6]">
                          <div className="w-8 h-8 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-4 h-4 text-[#7B6CFF]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111827] truncate">
                              {reg.user?.name ?? 'Unknown User'}
                            </p>
                            <p className="text-xs text-[#6B7280] truncate">
                              {reg.course?.title ?? 'Unknown Course'}
                            </p>
                            <p className="text-xs text-[#9CA3AF] mt-1">
                              {new Date(reg.registrationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    onClick={() => navigate('/admin/registrations')}
                    variant="ghost"
                    className="w-full mt-4 text-[#7B6CFF] hover:bg-[#7B6CFF]/10"
                  >
                    View All Registrations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

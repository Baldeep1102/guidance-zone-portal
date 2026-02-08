import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, Link as LinkIcon, Calendar, CheckCircle, Clock, ArrowRight, User as UserIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { registrationsApi } from '@/api/registrations';
import type { Registration } from '@/types';

export function Dashboard() {
  const { user } = useAuth();
  const { data: registrations, loading } = useApi<Registration[]>(registrationsApi.getMy);
  const allRegistrations = registrations || [];

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'audio': return LinkIcon;
      default: return LinkIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
            My Learning
          </span>
          <h1 className="font-heading text-4xl lg:text-5xl font-semibold text-[#111827] mb-4">
            Welcome back, {user?.name?.split(' ')[0] || 'Seeker'}
          </h1>
          <p className="text-[#6B7280] text-base lg:text-lg">
            Track your progress and access your course materials.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Courses Enrolled', value: allRegistrations.length, icon: BookOpen },
            { label: 'Confirmed', value: allRegistrations.filter(r => r.status === 'CONFIRMED').length, icon: CheckCircle },
            { label: 'Pending', value: allRegistrations.filter(r => r.status === 'PENDING').length, icon: Clock },
            { label: 'Total', value: allRegistrations.length, icon: Calendar },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-[22px] card-shadow-light p-6">
              <stat.icon className="w-6 h-6 text-[#7B6CFF] mb-3" />
              <div className="font-heading text-2xl font-semibold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-[#6B7280]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div className="mb-12">
          <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">My Courses</h2>
          {allRegistrations.length === 0 ? (
            <div className="bg-white rounded-[22px] card-shadow-light p-12 text-center">
              <BookOpen className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-[#111827] mb-2">No courses yet</h3>
              <p className="text-[#6B7280] mb-6">Explore our courses and start your spiritual journey today.</p>
              <Link to="/courses">
                <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full">
                  Browse Courses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {allRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-white rounded-[22px] card-shadow-light overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-64 h-40 lg:h-auto flex-shrink-0">
                      <img
                        src={registration.course?.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'}
                        alt={registration.course?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            registration.course?.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                            registration.course?.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {registration.course?.level}
                          </span>
                          <h3 className="font-heading text-lg font-semibold text-[#111827] mt-2">
                            {registration.course?.title}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          registration.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          registration.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {registration.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                        {registration.course?.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-6">
                        <span>Registered: {new Date(registration.registrationDate).toLocaleDateString()}</span>
                        {registration.course?.startDate && (
                          <span>Starts: {new Date(registration.course.startDate).toLocaleDateString()}</span>
                        )}
                      </div>

                      {/* Join Link */}
                      {registration.course?.joinLink && registration.status === 'CONFIRMED' && (
                        <div className="mb-4">
                          <a
                            href={registration.course.joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B6CFF] text-white text-sm hover:bg-[#6B5CFF] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join Session
                          </a>
                        </div>
                      )}

                      {/* Course Materials */}
                      {registration.course?.materials && registration.course.materials.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[#374151] mb-3">Course Materials</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {registration.course.materials.map((material) => {
                              const Icon = getMaterialIcon(material.type);
                              return (
                                <a
                                  key={material.id}
                                  href={material.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-[#7B6CFF]/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-[#7B6CFF]" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-[#111827] truncate group-hover:text-[#7B6CFF] transition-colors">
                                      {material.title}
                                    </p>
                                    <p className="text-xs text-[#9CA3AF] capitalize">{material.type}</p>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        {user && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">My Profile</h2>
            <div className="bg-white rounded-[22px] card-shadow-light p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-8 h-8 text-[#7B6CFF]" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-[#111827]">{user.name}</h3>
                  <p className="text-sm text-[#6B7280]">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F9FAFB]">
                  <p className="text-xs text-[#9CA3AF] mb-1">Phone</p>
                  <p className="text-sm text-[#374151]">{user.phone || '-'}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F9FAFB]">
                  <p className="text-xs text-[#9CA3AF] mb-1">Member Since</p>
                  <p className="text-sm text-[#374151]">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F9FAFB]">
                  <p className="text-xs text-[#9CA3AF] mb-1">Courses</p>
                  <p className="text-sm text-[#374151]">{allRegistrations.length} enrolled</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

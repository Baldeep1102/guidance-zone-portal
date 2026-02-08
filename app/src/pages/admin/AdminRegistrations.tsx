import { useState } from 'react';
import { Search, Users, Calendar, Mail, Phone, BookOpen, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/useApi';
import { registrationsApi } from '@/api/registrations';
import type { Registration } from '@/types';

export function AdminRegistrations() {
  const { data: registrations, loading, error, refetch } = useApi<Registration[]>(registrationsApi.getAll);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const allRegistrations = registrations || [];

  const courses = ['All', ...Array.from(new Set(allRegistrations.map(r => r.course?.title).filter(Boolean)))];

  const filteredRegistrations = allRegistrations.filter(reg => {
    const matchesSearch =
      (reg.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.course?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === 'All' || reg.course?.title === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await registrationsApi.updateStatus(id, newStatus);
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Course', 'Registration Date', 'Status'];
    const rows = filteredRegistrations.map(reg => [
      reg.user?.name || '',
      reg.user?.email || '',
      reg.user?.phone || '',
      reg.course?.title || '',
      new Date(reg.registrationDate).toLocaleDateString(),
      reg.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-2 block">
              Admin Panel
            </span>
            <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">
              Registrations
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={exportCSV}
              variant="outline"
              className="rounded-full border-[#E5E7EB]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-8">
            Failed to load registrations: {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Registrations', value: allRegistrations.length, icon: Users },
            { label: 'Confirmed', value: allRegistrations.filter(r => r.status === 'CONFIRMED').length, icon: Calendar },
            { label: 'Pending', value: allRegistrations.filter(r => r.status === 'PENDING').length, icon: Filter },
            { label: 'Cancelled', value: allRegistrations.filter(r => r.status === 'CANCELLED').length, icon: Users },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-[22px] card-shadow-light p-5">
              <stat.icon className="w-5 h-5 text-[#7B6CFF] mb-3" />
              <div className="font-heading text-2xl font-semibold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-[#6B7280]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search by name, email, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white"
            />
          </div>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-3 rounded-full border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent"
          >
            {courses.map(course => <option key={course} value={course}>{course}</option>)}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280]">Loading registrations...</p>
          </div>
        )}

        {/* Registrations Table */}
        {!loading && (
          <div className="bg-white rounded-[22px] card-shadow-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F3F4F6]">
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">User</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Course</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Registration Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB]">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#7B6CFF]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#111827]">{reg.user?.name || 'Unknown'}</p>
                            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                              <Mail className="w-3 h-3" /> {reg.user?.email || '-'}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                              <Phone className="w-3 h-3" /> {reg.user?.phone || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#7B6CFF]" />
                          <span className="text-sm text-[#374151]">{reg.course?.title || 'Unknown'}</span>
                        </div>
                        <span className={`text-xs ${
                          reg.course?.level === 'Beginner' ? 'text-green-600' :
                          reg.course?.level === 'Intermediate' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {reg.course?.level || ''}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Calendar className="w-4 h-4" />
                          {new Date(reg.registrationDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={reg.status}
                          onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                          disabled={updatingId === reg.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-[#7B6CFF] ${
                            reg.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          } ${updatingId === reg.id ? 'opacity-50' : ''}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRegistrations.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
                <p className="text-[#6B7280]">No registrations found.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination info */}
        {!loading && (
          <div className="mt-4 text-sm text-[#6B7280]">
            Showing {filteredRegistrations.length} of {allRegistrations.length} registrations
          </div>
        )}
      </div>
    </div>
  );
}

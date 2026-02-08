import { useState } from 'react';
import { Search, Users, Mail, Phone, Shield, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/useApi';
import type { User } from '@/types';
import client from '@/api/client';

export function AdminUsers() {
  const { data: users, loading } = useApi<User[]>(() => client.get('/users'), []);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (users || []).filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-2 block">Admin Panel</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">Users</h1>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="bg-white rounded-[22px] card-shadow-light p-5 flex-1">
            <Users className="w-5 h-5 text-[#7B6CFF] mb-2" />
            <div className="font-heading text-2xl font-semibold text-[#111827]">{(users || []).length}</div>
            <div className="text-sm text-[#6B7280]">Total Users</div>
          </div>
          <div className="bg-white rounded-[22px] card-shadow-light p-5 flex-1">
            <Shield className="w-5 h-5 text-green-500 mb-2" />
            <div className="font-heading text-2xl font-semibold text-[#111827]">{(users || []).filter(u => u.emailVerified).length}</div>
            <div className="text-sm text-[#6B7280]">Verified</div>
          </div>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white" />
        </div>

        <div className="bg-white rounded-[22px] card-shadow-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">User</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Provider</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Courses</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-[#6B7280]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB]">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-[#7B6CFF]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{user.name}</p>
                          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                              <Phone className="w-3 h-3" /> {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#6B7280]">{user.authProvider}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#374151]">{user._count?.registrations || 0}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
              <p className="text-[#6B7280]">No users found.</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-[#6B7280]">
          Showing {filtered.length} of {(users || []).length} users
        </div>
      </div>
    </div>
  );
}

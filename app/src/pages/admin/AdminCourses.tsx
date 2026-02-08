import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApi } from '@/hooks/useApi';
import { coursesApi } from '@/api/courses';
import type { Course } from '@/types';

export function AdminCourses() {
  const { data: courses, loading, error, refetch } = useApi<Course[]>(coursesApi.getAll);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: 'Acharya Navneetji',
    duration: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    thumbnail: '',
    startDate: '',
    endDate: '',
    isActive: true,
    maxParticipants: 50,
    recurrence: 'NONE' as 'NONE' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
    joinLink: '',
    paymentLink: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
  });

  const handleSave = async () => {
    if (!formData.title || !formData.description) return;
    setIsSaving(true);

    try {
      if (editingCourse) {
        await coursesApi.update(editingCourse.id, formData);
      } else {
        await coursesApi.create(formData);
      }
      await refetch();
      setIsDialogOpen(false);
      setEditingCourse(null);
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await coursesApi.remove(id);
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete course');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      thumbnail: course.thumbnail || '',
      startDate: course.startDate ? course.startDate.split('T')[0] : '',
      endDate: course.endDate ? course.endDate.split('T')[0] : '',
      isActive: course.isActive,
      maxParticipants: course.maxParticipants,
      recurrence: course.recurrence || 'NONE',
      joinLink: course.joinLink || '',
      paymentLink: course.paymentLink || '',
      visibility: course.visibility || 'PUBLIC',
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: 'Acharya Navneetji',
      duration: '',
      level: 'Beginner',
      thumbnail: '',
      startDate: '',
      endDate: '',
      isActive: true,
      maxParticipants: 50,
      recurrence: 'NONE',
      joinLink: '',
      paymentLink: '',
      visibility: 'PUBLIC',
    });
  };

  const filteredCourses = (courses || []).filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Manage Courses
            </h1>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-8">
            Failed to load courses: {error}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280]">Loading courses...</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-[22px] card-shadow-light overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.level}
                    </span>
                    {!course.isActive && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    )}
                    {course.recurrence && course.recurrence !== 'NONE' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {course.recurrence}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[#111827] mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {course.registeredCount}/{course.maxParticipants}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(course)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full border-[#E5E7EB]"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(course.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No courses found.</p>
          </div>
        )}

        {/* Edit/Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-[22px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="Course title"
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Course description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                    placeholder="e.g., 4 weeks"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Thumbnail URL</label>
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="Image URL"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Recurrence</label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm"
                  >
                    <option value="NONE">None</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BIWEEKLY">Biweekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Join Link (Zoom/Meet)</label>
                <Input
                  value={formData.joinLink}
                  onChange={(e) => setFormData({ ...formData, joinLink: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="https://zoom.us/..."
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Payment Link</label>
                <Input
                  value={formData.paymentLink}
                  onChange={(e) => setFormData({ ...formData, paymentLink: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#7B6CFF]"
                  />
                  <label htmlFor="isActive" className="text-sm text-[#374151]">Active</label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                  className="rounded-full border-[#E5E7EB]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

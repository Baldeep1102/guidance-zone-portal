import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, ArrowRight, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { coursesApi } from '@/api/courses';
import { registrationsApi } from '@/api/registrations';
import type { Course } from '@/types';

export function Courses() {
  const { data: courses, loading } = useApi<Course[]>(coursesApi.getAll);
  const allCourses = courses || [];
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    let filtered = allCourses;

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [selectedLevel, searchQuery, allCourses]);

  const handleRegisterClick = (course: Course) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedCourse(course);
    setIsRegistered(false);
    setIsRegisterDialogOpen(true);
  };

  const handleRegistrationSubmit = async () => {
    if (!selectedCourse || !user) return;
    setIsRegistering(true);

    try {
      await registrationsApi.register(selectedCourse.id);
      setIsRegistered(true);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setIsRegistered(true);
      } else {
        alert(err.response?.data?.error || 'Registration failed');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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
            Learning Paths
          </span>
          <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-[#111827] mb-4">
            Upcoming Courses
          </h1>
          <p className="text-[#6B7280] text-base lg:text-lg max-w-2xl">
            Structured programs designed to guide you deeper into your spiritual practice. Each course combines teachings, practices, and community support.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#7B6CFF]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? 'bg-[#7B6CFF] text-white'
                    : 'bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Course */}
        {filteredCourses[0] && (
          <div className="mb-16">
            <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">Featured Course</h2>
            <div className="bg-white rounded-[28px] card-shadow-light overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 h-[30vh] lg:h-auto">
                  <img
                    src={filteredCourses[0].thumbnail}
                    alt={filteredCourses[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      filteredCourses[0].level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      filteredCourses[0].level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {filteredCourses[0].level}
                    </span>
                    <span className="text-sm text-[#6B7280]">{filteredCourses[0].duration}</span>
                  </div>
                  <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-[#111827] mb-4">
                    {filteredCourses[0].title}
                  </h3>
                  <p className="text-[#6B7280] text-base leading-relaxed mb-6">
                    {filteredCourses[0].description}
                  </p>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Users className="w-4 h-4" />
                      <span>{filteredCourses[0].registeredCount} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Calendar className="w-4 h-4" />
                      <span>Starts {new Date(filteredCourses[0].startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRegisterClick(filteredCourses[0])}
                    className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-8 py-5 w-fit"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Dialog */}
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[22px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {isRegistered ? 'Registration Complete!' : `Register for ${selectedCourse?.title}`}
              </DialogTitle>
              <DialogDescription>
                {isRegistered
                  ? 'You are registered for this course. View it in your dashboard.'
                  : 'Confirm your registration for this course.'}
              </DialogDescription>
            </DialogHeader>

            {isRegistered ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-[#6B7280] mb-6">You have successfully registered for this course.</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full flex-1"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsRegisterDialogOpen(false)}
                    className="rounded-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-[#374151] mb-4">Registering as <strong>{user?.name}</strong></p>
                <p className="text-[#6B7280] text-sm mb-6">{user?.email}</p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRegistrationSubmit}
                    disabled={isRegistering}
                    className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full flex-1"
                  >
                    {isRegistering ? 'Registering...' : 'Confirm Registration'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsRegisterDialogOpen(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* All Courses Grid */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">
            {selectedLevel === 'All' ? 'All Courses' : `${selectedLevel} Courses`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.slice(1).map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-[22px] card-shadow-light overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.level}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">{course.duration}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[#111827] mb-2 group-hover:text-[#7B6CFF] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                      <Users className="w-3 h-3" />
                      <span>{course.registeredCount} enrolled</span>
                    </div>
                    <Button
                      onClick={() => handleRegisterClick(course)}
                      size="sm"
                      className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-4"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

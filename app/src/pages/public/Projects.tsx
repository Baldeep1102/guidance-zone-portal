import { useState, useEffect } from 'react';
import { MapPin, Heart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { projectsApi } from '@/api/projects';
import { useApi } from '@/hooks/useApi';
import type { Project } from '@/types';

const statusColors: Record<string, string> = {
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  UPCOMING: 'bg-yellow-100 text-yellow-700',
};

export function Projects() {
  const { data: projects, loading } = useApi<Project[]>(() => projectsApi.getAll(), []);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!projects) return;
    let filtered = projects;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProjects(filtered);
  }, [selectedCategory, searchQuery, projects]);

  const categories = ['All', ...Array.from(new Set((projects || []).map(p => p.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const featured = filteredProjects.filter(p => p.featured);
  const rest = filteredProjects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Hero Header */}
        <div className="mb-12">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
            Philanthropy & Service
          </span>
          <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-[#111827] mb-4">
            Projects & Impact
          </h1>
          <p className="text-[#6B7280] text-base lg:text-lg max-w-2xl">
            Acharya Navneetji's community initiatives—education, healthcare, environment, and more. Spiritual practice in action.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#7B6CFF] text-white'
                    : 'bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">Featured Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map((project) => (
                <div key={project.id} className="bg-white rounded-[28px] card-shadow-light overflow-hidden hover:shadow-xl transition-shadow">
                  {project.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                      <span className="text-xs text-[#7B6CFF] font-medium">{project.category}</span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-[#111827] mb-2">{project.title}</h3>
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-3">{project.description}</p>
                    {project.location && (
                      <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.impactStats && (
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-[#F3F4F6]">
                        {Object.entries(project.impactStats as Record<string, any>).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-heading text-lg font-semibold text-[#7B6CFF]">{String(value)}</div>
                            <div className="text-xs text-[#9CA3AF] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">
            {selectedCategory === 'All' ? 'All Projects' : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((project) => (
              <div key={project.id} className="bg-white rounded-[22px] card-shadow-light overflow-hidden hover:shadow-lg transition-shadow">
                {project.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-[#7B6CFF] font-medium">{project.category}</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-[#111827] mb-2">{project.title}</h3>
                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">{project.description}</p>
                  {project.location && (
                    <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                      <MapPin className="w-3 h-3" />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
            <p className="text-[#6B7280] text-lg">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Play, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { talksApi } from '@/api/talks';
import { useApi } from '@/hooks/useApi';
import type { Talk } from '@/types';

export function Talks() {
  const { data: talks, loading } = useApi<Talk[]>(talksApi.getAll);
  const allTalks = talks || [];

  const [filteredTalks, setFilteredTalks] = useState<Talk[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);

  useEffect(() => {
    let filtered = allTalks;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(talk => talk.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(talk =>
        talk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTalks(filtered);
  }, [selectedCategory, searchQuery, allTalks]);

  const categories = ['All', ...Array.from(new Set(allTalks.map(t => t.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <Spinner className="w-8 h-8 text-[#7B6CFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
            Wisdom Library
          </span>
          <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-[#111827] mb-4">
            Talks & Teachings
          </h1>
          <p className="text-[#6B7280] text-base lg:text-lg max-w-2xl">
            Explore the wisdom teachings of Acharya Navneetji. Each talk is a doorway to deeper understanding and inner peace.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search talks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#7B6CFF]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#7B6CFF] text-white'
                    : 'bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Talk */}
        {!selectedTalk && filteredTalks.find(t => t.featured) && (
          <div className="mb-12">
            <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">Featured</h2>
            {filteredTalks.filter(t => t.featured).slice(0, 1).map((talk) => (
              <div
                key={talk.id}
                onClick={() => setSelectedTalk(talk)}
                className="w-full h-[50vh] lg:h-[60vh] rounded-[28px] overflow-hidden card-shadow-light relative group cursor-pointer"
              >
                <img
                  src={talk.thumbnail ?? undefined}
                  alt={talk.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#7B6CFF] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" fill="white" />
                  </button>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#7B6CFF] text-white text-xs font-medium">
                      {talk.category}
                    </span>
                    <span className="flex items-center gap-1 text-[rgba(255,255,255,0.7)] text-sm">
                      <Clock className="w-4 h-4" /> {talk.duration}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-2">
                    {talk.title}
                  </h3>
                  <p className="text-[rgba(255,255,255,0.7)] text-sm lg:text-base max-w-xl">
                    {talk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {selectedTalk && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-5xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold text-white">{selectedTalk.title}</h3>
                <button
                  onClick={() => setSelectedTalk(null)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="aspect-video rounded-[20px] overflow-hidden bg-black">
                <iframe
                  src={selectedTalk.youtubeUrl}
                  title={selectedTalk.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4">
                <p className="text-[rgba(255,255,255,0.7)] text-sm">{selectedTalk.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Talks Grid */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">
            {selectedCategory === 'All' ? 'All Talks' : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalks.map((talk) => (
              <div
                key={talk.id}
                onClick={() => setSelectedTalk(talk)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[22px] overflow-hidden card-shadow-light mb-4">
                  <img
                    src={talk.thumbnail ?? undefined}
                    alt={talk.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#7B6CFF] flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                    {talk.duration}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#7B6CFF] font-medium">{talk.category}</span>
                  <span className="text-[#D1D5DB]">·</span>
                  <span className="text-xs text-[#9CA3AF]">{talk.date}</span>
                </div>
                <h3 className="font-heading text-base font-medium text-[#111827] mb-2 group-hover:text-[#7B6CFF] transition-colors">
                  {talk.title}
                </h3>
                <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
                  {talk.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {talk.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTalks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No talks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

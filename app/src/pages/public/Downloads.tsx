import { useState, useEffect } from 'react';
import { Download as DownloadIcon, Search, FileText, Music, Video, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { downloadsApi } from '@/api/downloads';
import { useApi } from '@/hooks/useApi';
import type { Download } from '@/types';

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  audio: Music,
  video: Video,
};

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Downloads() {
  const { data: downloads, loading } = useApi<Download[]>(() => downloadsApi.getAll(), []);
  const [filteredDownloads, setFilteredDownloads] = useState<Download[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!downloads) return;
    let filtered = downloads;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDownloads(filtered);
  }, [selectedCategory, searchQuery, downloads]);

  const categories = ['All', ...Array.from(new Set((downloads || []).map(d => d.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center pt-24">
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
            Resources
          </span>
          <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-[#111827] mb-4">
            Downloads
          </h1>
          <p className="text-[#6B7280] text-base lg:text-lg max-w-2xl">
            Free resources to support your spiritual practice. Guides, mantras, journal templates, and more.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search downloads..."
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

        {/* Featured Downloads */}
        {filteredDownloads.filter(d => d.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">Featured</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDownloads.filter(d => d.featured).map((dl) => {
                const Icon = fileTypeIcons[dl.fileType] || File;
                return (
                  <div key={dl.id} className="bg-white rounded-[28px] card-shadow-light p-6 lg:p-8 flex gap-6 hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-[#7B6CFF]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-[#7B6CFF]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-[#111827] mb-1">{dl.title}</h3>
                      <p className="text-sm text-[#6B7280] mb-3">{dl.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-[#9CA3AF] uppercase">{dl.fileType}</span>
                        {dl.fileSize && <span className="text-xs text-[#9CA3AF]">{formatFileSize(dl.fileSize)}</span>}
                        <a href={dl.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-4">
                            <DownloadIcon className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Downloads Grid */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDownloads.map((dl) => {
              const Icon = fileTypeIcons[dl.fileType] || File;
              return (
                <div key={dl.id} className="bg-white rounded-[22px] card-shadow-light p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#7B6CFF]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#7B6CFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-base font-semibold text-[#111827] mb-1 truncate">
                        {dl.title}
                      </h3>
                      <span className="text-xs text-[#7B6CFF] font-medium">{dl.category}</span>
                    </div>
                  </div>
                  {dl.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{dl.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                      <span className="uppercase">{dl.fileType}</span>
                      {dl.fileSize && <span>{formatFileSize(dl.fileSize)}</span>}
                    </div>
                    <a href={dl.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="rounded-full border-[#7B6CFF] text-[#7B6CFF] hover:bg-[#7B6CFF] hover:text-white px-4">
                        <DownloadIcon className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredDownloads.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No downloads found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

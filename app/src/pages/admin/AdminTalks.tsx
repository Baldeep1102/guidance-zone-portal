import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApi } from '@/hooks/useApi';
import { talksApi } from '@/api/talks';
import type { Talk } from '@/types';

export function AdminTalks() {
  const { data: talks, loading, error, refetch } = useApi<Talk[]>(talksApi.getAll);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState<Talk | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Talk>>({
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnail: '',
    duration: '',
    category: 'Wisdom Talks',
    tags: [],
    date: new Date().toISOString().split('T')[0],
    featured: false,
  });
  const [tagInput, setTagInput] = useState('');

  const handleSave = async () => {
    if (!formData.title || !formData.youtubeUrl) return;
    setIsSaving(true);

    try {
      const payload = {
        title: formData.title || '',
        description: formData.description || '',
        youtubeUrl: formData.youtubeUrl || '',
        thumbnail: formData.thumbnail || null,
        duration: formData.duration || '',
        category: formData.category || 'Wisdom Talks',
        tags: formData.tags || [],
        date: formData.date || new Date().toISOString().split('T')[0],
        featured: formData.featured || false,
      };

      if (editingTalk) {
        await talksApi.update(editingTalk.id, payload);
      } else {
        await talksApi.create(payload);
      }

      await refetch();
      setIsDialogOpen(false);
      setEditingTalk(null);
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save talk');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this talk?')) return;

    try {
      await talksApi.remove(id);
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete talk');
    }
  };

  const handleEdit = (talk: Talk) => {
    setEditingTalk(talk);
    setFormData({
      ...talk,
      date: talk.date ? talk.date.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTalk(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      thumbnail: '',
      duration: '',
      category: 'Wisdom Talks',
      tags: [],
      date: new Date().toISOString().split('T')[0],
      featured: false,
    });
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(tag => tag !== tagToRemove) || [] });
  };

  const filteredTalks = (talks || []).filter(talk =>
    talk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talk.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Wisdom Talks', 'Spiritual Discourses', 'Q&A Sessions', 'Meditation Guides'];

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
              Manage Talks
            </h1>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Talk
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-8">
            Failed to load talks: {error}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            type="text"
            placeholder="Search talks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280]">Loading talks...</p>
          </div>
        )}

        {/* Talks Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalks.map((talk) => (
              <div key={talk.id} className="bg-white rounded-[22px] card-shadow-light overflow-hidden">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={talk.thumbnail || 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80'}
                    alt={talk.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" fill="white" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                    {talk.duration}
                  </div>
                  {talk.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#7B6CFF] text-white text-xs">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs text-[#7B6CFF] font-medium">{talk.category}</span>
                  <h3 className="font-heading text-lg font-semibold text-[#111827] mb-2 line-clamp-1">
                    {talk.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
                    {talk.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {talk.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(talk)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full border-[#E5E7EB]"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(talk.id)}
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

        {!loading && filteredTalks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No talks found.</p>
          </div>
        )}

        {/* Edit/Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-[22px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingTalk ? 'Edit Talk' : 'Add New Talk'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="Talk title"
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Talk description"
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">YouTube URL</label>
                <Input
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Thumbnail URL</label>
                  <Input
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                    placeholder="Image URL"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                    placeholder="e.g., 45:30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="rounded-xl border-[#E5E7EB] flex-1"
                    placeholder="Add tag and press Enter"
                  />
                  <Button onClick={addTag} type="button" variant="outline" className="rounded-xl">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#7B6CFF]/10 text-[#7B6CFF] text-sm flex items-center gap-2">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#7B6CFF] focus:ring-[#7B6CFF]"
                />
                <label htmlFor="featured" className="text-sm text-[#374151]">Featured on homepage</label>
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

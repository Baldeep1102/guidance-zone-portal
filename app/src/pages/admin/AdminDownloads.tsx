import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { downloadsApi } from '@/api/downloads';
import { useApi } from '@/hooks/useApi';
import type { Download } from '@/types';

export function AdminDownloads() {
  const { data: downloads, loading, refetch } = useApi<Download[]>(() => downloadsApi.getAll(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<Download | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Meditation', fileUrl: '', fileType: 'pdf',
    fileSize: 0, thumbnail: '', featured: false,
  });

  const handleSave = async () => {
    if (!formData.title || !formData.fileUrl) return;
    try {
      if (editingDownload) {
        await downloadsApi.update(editingDownload.id, formData);
      } else {
        await downloadsApi.create(formData);
      }
      setIsDialogOpen(false);
      setEditingDownload(null);
      resetForm();
      refetch();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this download?')) return;
    try {
      await downloadsApi.remove(id);
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (dl: Download) => {
    setEditingDownload(dl);
    setFormData({
      title: dl.title, description: dl.description || '', category: dl.category,
      fileUrl: dl.fileUrl, fileType: dl.fileType, fileSize: dl.fileSize || 0,
      thumbnail: dl.thumbnail || '', featured: dl.featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', category: 'Meditation', fileUrl: '', fileType: 'pdf',
      fileSize: 0, thumbnail: '', featured: false,
    });
  };

  const filtered = (downloads || []).filter(dl =>
    dl.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Meditation', 'Devotion', 'Practice', 'Wisdom', 'Community'];

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-2 block">Admin Panel</span>
            <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">Manage Downloads</h1>
          </div>
          <Button onClick={() => { setEditingDownload(null); resetForm(); setIsDialogOpen(true); }} className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" /> Add Download
          </Button>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input type="text" placeholder="Search downloads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dl) => (
            <div key={dl.id} className="bg-white rounded-[22px] card-shadow-light p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#7B6CFF]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#7B6CFF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base font-semibold text-[#111827] truncate">{dl.title}</h3>
                  <span className="text-xs text-[#7B6CFF]">{dl.category}</span>
                  {dl.featured && <span className="ml-2 text-xs text-yellow-600">Featured</span>}
                </div>
              </div>
              <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{dl.description}</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(dl)} variant="outline" size="sm" className="flex-1 rounded-full border-[#E5E7EB]">
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button onClick={() => handleDelete(dl.id)} variant="outline" size="sm" className="rounded-full border-red-200 text-red-500 hover:bg-red-50">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div className="text-center py-20"><p className="text-[#6B7280] text-lg">No downloads found.</p></div>}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-[22px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{editingDownload ? 'Edit Download' : 'Add New Download'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Title</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="rounded-xl border-[#E5E7EB]" placeholder="Download title" />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">File Type</label>
                  <select value={formData.fileType} onChange={(e) => setFormData({ ...formData, fileType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm">
                    <option value="pdf">PDF</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">File URL</label>
                <Input value={formData.fileUrl} onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} className="rounded-xl border-[#E5E7EB]" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded border-[#E5E7EB] text-[#7B6CFF]" />
                <label htmlFor="featured" className="text-sm text-[#374151]">Featured</label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full"><Check className="w-4 h-4 mr-2" /> Save</Button>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="rounded-full border-[#E5E7EB]"><X className="w-4 h-4 mr-2" /> Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

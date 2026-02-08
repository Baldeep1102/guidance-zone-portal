import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { projectsApi } from '@/api/projects';
import { useApi } from '@/hooks/useApi';
import type { Project } from '@/types';

const statusColors: Record<string, string> = {
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  UPCOMING: 'bg-yellow-100 text-yellow-700',
};

export function AdminProjects() {
  const { data: projects, loading, refetch } = useApi<Project[]>(() => projectsApi.getAll(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', coverImage: '', category: 'Education',
    status: 'ONGOING' as 'ONGOING' | 'COMPLETED' | 'UPCOMING',
    location: '', featured: false, gallery: [] as string[],
  });

  const handleSave = async () => {
    if (!formData.title || !formData.description) return;
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, formData);
      } else {
        await projectsApi.create(formData);
      }
      setIsDialogOpen(false);
      setEditingProject(null);
      resetForm();
      refetch();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsApi.remove(id);
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title, description: project.description,
      coverImage: project.coverImage || '', category: project.category,
      status: project.status, location: project.location || '',
      featured: project.featured, gallery: project.gallery || [],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', coverImage: '', category: 'Education',
      status: 'ONGOING', location: '', featured: false, gallery: [],
    });
  };

  const filtered = (projects || []).filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Education', 'Healthcare', 'Community', 'Environment', 'Spiritual'];

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
            <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">Manage Projects</h1>
          </div>
          <Button onClick={() => { setEditingProject(null); resetForm(); setIsDialogOpen(true); }} className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div key={project.id} className="bg-white rounded-[22px] card-shadow-light overflow-hidden">
              {project.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-[#7B6CFF]">{project.category}</span>
                  {project.featured && <span className="text-xs text-yellow-600">Featured</span>}
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#111827] mb-2">{project.title}</h3>
                <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">{project.description}</p>
                {project.location && (
                  <div className="flex items-center gap-1 text-xs text-[#9CA3AF] mb-4">
                    <MapPin className="w-3 h-3" /> {project.location}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(project)} variant="outline" size="sm" className="flex-1 rounded-full border-[#E5E7EB]">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(project.id)} variant="outline" size="sm" className="rounded-full border-red-200 text-red-500 hover:bg-red-50">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div className="text-center py-20"><p className="text-[#6B7280] text-lg">No projects found.</p></div>}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-[22px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Title</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="rounded-xl border-[#E5E7EB]" />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm resize-none" rows={3} />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Cover Image URL</label>
                <Input value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} className="rounded-xl border-[#E5E7EB]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm">
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="UPCOMING">Upcoming</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Location</label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="rounded-xl border-[#E5E7EB]" placeholder="City, Country" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded" />
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

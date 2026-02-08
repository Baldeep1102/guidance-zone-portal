import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApi } from '@/hooks/useApi';
import { booksApi } from '@/api/books';
import type { Book } from '@/types';

export function AdminBooks() {
  const { data: books, loading, error, refetch } = useApi<Book[]>(booksApi.getAll);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: 'Acharya Navneetji',
    description: '',
    coverImage: '',
    publishYear: new Date().getFullYear(),
    category: 'Meditation',
    purchaseLink: '',
    featured: false,
  });

  const handleSave = async () => {
    if (!formData.title || !formData.description) return;
    setIsSaving(true);

    try {
      const payload = {
        title: formData.title || '',
        author: formData.author || 'Acharya Navneetji',
        description: formData.description || '',
        coverImage: formData.coverImage || null,
        publishYear: formData.publishYear || new Date().getFullYear(),
        category: formData.category || 'Meditation',
        purchaseLink: formData.purchaseLink || '',
        featured: formData.featured || false,
      };

      if (editingBook) {
        await booksApi.update(editingBook.id, payload);
      } else {
        await booksApi.create(payload);
      }

      await refetch();
      setIsDialogOpen(false);
      setEditingBook(null);
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save book');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await booksApi.remove(id);
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete book');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: 'Acharya Navneetji',
      description: '',
      coverImage: '',
      publishYear: new Date().getFullYear(),
      category: 'Meditation',
      purchaseLink: '',
      featured: false,
    });
  };

  const filteredBooks = (books || []).filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Meditation', 'Spiritual Living', 'Devotion', 'Advanced Practice', 'Compassion', 'Wisdom'];

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
              Manage Books
            </h1>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-8">
            Failed to load books: {error}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 rounded-full border-[#E5E7EB] bg-white"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280]">Loading books...</p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-[22px] card-shadow-light overflow-hidden group">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80'}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#7B6CFF] text-white text-xs">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <Button
                      onClick={() => handleEdit(book)}
                      size="sm"
                      className="bg-white text-[#111827] rounded-full"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(book.id)}
                      size="sm"
                      className="bg-red-500 text-white rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#7B6CFF] font-medium">{book.category}</span>
                  <h3 className="font-heading text-sm font-semibold text-[#111827] mt-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-1">{book.publishYear}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No books found.</p>
          </div>
        )}

        {/* Edit/Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-[22px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="Book title"
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="rounded-xl border-[#E5E7EB]"
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Book description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Cover Image URL</label>
                  <Input
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                    placeholder="Image URL"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Publish Year</label>
                  <Input
                    type="number"
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                    className="rounded-xl border-[#E5E7EB]"
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
                  <label className="text-sm text-[#374151] mb-1 block">Purchase Link</label>
                  <Input
                    value={formData.purchaseLink}
                    onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                    placeholder="https://..."
                  />
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

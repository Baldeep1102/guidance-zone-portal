import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { booksApi } from '@/api/books';
import { useApi } from '@/hooks/useApi';
import type { Book } from '@/types';

export function Books() {
  const { data: books, loading } = useApi<Book[]>(booksApi.getAll);
  const allBooks = books || [];

  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    let filtered = allBooks;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [selectedCategory, searchQuery, allBooks]);

  const categories = ['All', ...Array.from(new Set(allBooks.map(b => b.category)))];

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
            Library
          </span>
          <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-[#111827] mb-4">
            Books by Acharya Navneetji
          </h1>
          <p className="text-[#6B7280] text-base lg:text-lg max-w-2xl">
            Discover the written wisdom of Acharya Navneetji. Each book is a guide for the spiritual journey, offering practical insights for daily life.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search books..."
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

        {/* Featured Books */}
        {!selectedBook && filteredBooks.filter(b => b.featured).length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">Featured Books</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBooks.filter(b => b.featured).slice(0, 2).map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="group cursor-pointer bg-white rounded-[28px] card-shadow-light p-6 lg:p-8 flex gap-6 hover:shadow-xl transition-shadow"
                >
                  <div className="w-32 lg:w-40 h-44 lg:h-56 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={book.coverImage ?? undefined}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-[#7B6CFF] font-medium mb-2">{book.category}</span>
                    <h3 className="font-heading text-xl lg:text-2xl font-semibold text-[#111827] mb-2 group-hover:text-[#7B6CFF] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-1">by {book.author}</p>
                    <p className="text-sm text-[#9CA3AF] mb-4">{book.publishYear}</p>
                    <p className="text-sm text-[#6B7280] line-clamp-3 mb-4">
                      {book.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-fit border-[#7B6CFF] text-[#7B6CFF] hover:bg-[#7B6CFF] hover:text-white rounded-full px-5 py-2 text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 lg:p-8">
            <div className="bg-white rounded-[28px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8 lg:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div />
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-64 h-80 lg:h-96 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={selectedBook.coverImage ?? undefined}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-[#7B6CFF] font-medium mb-2 block">{selectedBook.category}</span>
                    <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-[#111827] mb-2">
                      {selectedBook.title}
                    </h2>
                    <p className="text-sm text-[#6B7280] mb-1">by {selectedBook.author}</p>
                    <p className="text-sm text-[#9CA3AF] mb-6">{selectedBook.publishYear}</p>
                    <p className="text-base text-[#374151] leading-relaxed mb-8">
                      {selectedBook.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-6 py-3">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Purchase Book
                      </Button>
                      {selectedBook.purchaseLink && (
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] rounded-full px-6 py-3"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Online
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Books Grid */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-[#111827] mb-6">
            {selectedCategory === 'All' ? 'All Books' : selectedCategory}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-[22px] overflow-hidden card-shadow-light mb-4">
                  <img
                    src={book.coverImage ?? undefined}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs text-[#7B6CFF] font-medium">{book.category}</span>
                <h3 className="font-heading text-sm font-medium text-[#111827] mt-1 group-hover:text-[#7B6CFF] transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1">{book.publishYear}</p>
              </div>
            ))}
          </div>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

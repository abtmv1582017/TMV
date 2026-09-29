import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Library,
  BookOpen,
  Search,
  ExternalLink,
  Download,
  Bookmark,
  Building2,
  GraduationCap
} from 'lucide-react';

export const DigitalLibraryView: React.FC = () => {
  const { language } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const libraryItems = [
    {
      id: 'lib-1',
      title: 'Introduction to Algorithms (CLRS) - Study Compendium',
      authors: 'Cormen, Leiserson, Rivest, Stein',
      category: 'Computer Science',
      type: 'Reference Text',
      year: '4th Edition',
      access: 'Institutional E-Access',
      description: 'Prescribed reference text for CMSA-CC-301. Covers advanced dynamic programming, greedy methods, and graph theory.'
    },
    {
      id: 'lib-2',
      title: 'Operating System Concepts (Silberschatz & Galvin)',
      authors: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
      category: 'Computer Science',
      type: 'Standard Textbook',
      year: '10th Edition',
      access: 'Library Open Collection',
      description: 'Foundational concepts in process management, storage structures, kernel memory allocation, and virtual machines.'
    },
    {
      id: 'lib-3',
      title: 'চর্যাপদ ও মধ্যযুগীয় বাংলা কাব্য সংকলন (Charyapada Textual Survey)',
      authors: 'ডঃ সুকুমার সেন (Dr. Sukumar Sen)',
      category: 'Bengali Literature',
      type: 'Classical Manuscript Study',
      year: 'Classical Edition',
      access: 'Rare Archival Edition',
      description: 'আদি মধ্যযুগীয় বাংলা সমাজচিত্র, ভাষা বিবর্তন ও চর্যাপদের মূল পদসমূহের তুলনামূলক ভাষাতাত্ত্বিক বিশ্লেষণ।'
    },
    {
      id: 'lib-4',
      title: 'Tamralipta: The Ancient Maritime Port of Eastern India',
      authors: 'Archaeological Survey of India & Midnapore Heritage Cell',
      category: 'History',
      type: 'Monograph',
      year: 'Research Archive',
      access: 'Open Access Research',
      description: 'Historical artifacts, Buddhist trade routes, and maritime chronicles of ancient Tamluk (Tamralipta).'
    },
    {
      id: 'lib-5',
      title: 'Introductory Methods of Numerical Analysis',
      authors: 'S. S. Sastry',
      category: 'Mathematics',
      type: 'Textbook',
      year: '5th Edition',
      access: 'Institutional E-Access',
      description: 'Newton forward-backward formulas, Runge-Kutta differential algorithms, and matrix eigenvalues.'
    }
  ];

  const nationalPortals = [
    {
      name: 'National Digital Library of India (NDLI)',
      sub: 'MHRD / IIT Kharagpur National Repository',
      url: 'https://ndl.iitkgp.ac.in',
      desc: 'Free access to millions of academic books, articles, theses, and educational video lectures.'
    },
    {
      name: 'INFLIBNET N-LIST Consortium',
      sub: 'UGC-INFONET Digital Library Access',
      url: 'https://nlist.inflibnet.ac.in',
      desc: 'Over 6,000+ e-journals and 1,99,500+ e-books subscribed for college students and faculty.'
    },
    {
      name: 'Directory of Open Access Journals (DOAJ)',
      sub: 'Peer-reviewed Global Research',
      url: 'https://doaj.org',
      desc: 'High-quality, open access research papers across science, humanities, and technology.'
    }
  ];

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.authors.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || item.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'ডিজিটাল গ্রন্থাগার ও ই-রিসোর্স' : 'Digital Library & Research Repositories'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya Central Library · E-Books, Journals & National Digital Portals
          </p>
        </div>
      </div>

      {/* National Portal Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nationalPortals.map((portal, idx) => (
          <a
            key={idx}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-sky-700 text-xs font-semibold mb-1">
                <span>{portal.sub}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{portal.name}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{portal.desc}</p>
            </div>
            <span className="text-[11px] text-sky-700 font-semibold mt-3 block">
              Access Institutional Gateway →
            </span>
          </a>
        ))}
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or discipline..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Academic Disciplines</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Bengali Literature">Bengali Literature</option>
            <option value="History">History & Heritage</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>
      </div>

      {/* Catalog items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/50">
                  {item.category}
                </span>
                <span>{item.type}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">{item.title}</h3>
              <div className="text-xs text-slate-600 mt-1">Author(s): <strong>{item.authors}</strong> ({item.year})</div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold text-[11px]">{item.access}</span>
              <button
                onClick={() => alert(`Accessing digital edition of "${item.title}" via Tamralipta Central Library repository.`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-lg font-medium transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read E-Book</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, Eye, Mail } from 'lucide-react';

const categories = ['All', 'Health Tips', 'Disease Awareness', 'Nutrition', 'Wellness', 'Lab Technology', 'Preventive Care'];

const articles = [
  {
    id: 1, title: 'Understanding Your Complete Blood Count (CBC) Report', excerpt: 'Learn how to read and understand your CBC report including RBC, WBC, hemoglobin, and platelet counts. Decode what each parameter means for your health.',
    category: 'Health Tips', author: 'Dr. Venkatesh Murthy', date: 'Dec 15, 2024', readTime: '5 min', image: '🩸',
    tags: ['CBC', 'Blood Test', 'Health Education'], views: 15420, likes: 892, comments: 45, featured: true
  },
  {
    id: 2, title: 'The Importance of Vitamin D: Why You Need the Sunshine Vitamin', excerpt: 'Vitamin D deficiency is more common than you think. Discover its crucial role in bone health, immunity, and overall wellbeing.',
    category: 'Health Tips', author: 'Dr. Sunita Reddy', date: 'Dec 12, 2024', readTime: '4 min', image: '☀️',
    tags: ['Vitamin D', 'Nutrition', 'Wellness'], views: 12350, likes: 678, comments: 32, featured: true
  },
  {
    id: 3, title: 'Diabetes Prevention: 5 Lifestyle Changes That Make a Difference', excerpt: 'Simple yet effective lifestyle modifications that can significantly reduce your risk of developing type 2 diabetes.',
    category: 'Preventive Care', author: 'Dr. Arjun Mehta', date: 'Dec 10, 2024', readTime: '6 min', image: '🍎',
    tags: ['Diabetes', 'Prevention', 'Lifestyle'], views: 10890, likes: 745, comments: 28, featured: true
  },
  {
    id: 4, title: 'Thyroid Disorders: Symptoms, Diagnosis, and Treatment Options', excerpt: 'Thyroid issues affect millions. Learn to recognize the signs and understand available diagnostic and treatment options.',
    category: 'Disease Awareness', author: 'Dr. Priya Sharma', date: 'Dec 8, 2024', readTime: '7 min', image: '🏥',
    tags: ['Thyroid', 'Hormones', 'Diagnosis'], views: 9870, likes: 567, comments: 38, featured: false
  },
  {
    id: 5, title: 'The Role of Lipid Profile in Heart Disease Prevention', excerpt: 'Your cholesterol levels tell a story about your heart health. Understanding your lipid profile can help prevent cardiovascular disease.',
    category: 'Health Tips', author: 'Dr. Venkatesh Murthy', date: 'Dec 5, 2024', readTime: '5 min', image: '❤️',
    tags: ['Lipid Profile', 'Heart Health', 'Prevention'], views: 8760, likes: 634, comments: 22, featured: true
  },
  {
    id: 6, title: 'Iron Deficiency Anemia: Causes, Symptoms, and Treatment', excerpt: 'Fatigue, weakness, and pale skin could be signs of iron deficiency anemia. Learn about causes and effective treatments.',
    category: 'Disease Awareness', author: 'Dr. Sunita Reddy', date: 'Dec 3, 2024', readTime: '4 min', image: '💉',
    tags: ['Anemia', 'Iron', 'Nutrition'], views: 7650, likes: 456, comments: 19, featured: false
  },
  {
    id: 7, title: 'How to Prepare for a Blood Test: A Complete Guide', excerpt: 'Proper preparation ensures accurate test results. Learn about fasting requirements, medications, and tips for a smooth experience.',
    category: 'Health Tips', author: 'Dr. Arjun Mehta', date: 'Nov 30, 2024', readTime: '3 min', image: '📋',
    tags: ['Blood Test', 'Preparation', 'Tips'], views: 14500, likes: 923, comments: 56, featured: false
  },
  {
    id: 8, title: 'Understanding Liver Function Tests (LFT)', excerpt: 'Your liver performs over 500 vital functions. Learn how LFT helps assess liver health and detect potential issues early.',
    category: 'Lab Technology', author: 'Dr. Priya Sharma', date: 'Nov 28, 2024', readTime: '5 min', image: '🔬',
    tags: ['Liver Function', 'LFT', 'Diagnostics'], views: 6540, likes: 389, comments: 15, featured: false
  },
  {
    id: 9, title: 'The Gut-Brain Connection: How Your Diet Affects Mental Health', excerpt: 'Emerging research shows a strong link between gut health and mental wellbeing. Discover how nutrition impacts your mood.',
    category: 'Nutrition', author: 'Dr. Venkatesh Murthy', date: 'Nov 25, 2024', readTime: '6 min', image: '🧠',
    tags: ['Gut Health', 'Mental Health', 'Nutrition'], views: 11200, likes: 834, comments: 41, featured: false
  },
  {
    id: 10, title: 'Kidney Function Test (KFT): What Your Results Mean', excerpt: 'Understand the key parameters in a KFT report and what they reveal about your kidney health.',
    category: 'Lab Technology', author: 'Dr. Sunita Reddy', date: 'Nov 22, 2024', readTime: '4 min', image: '🫘',
    tags: ['Kidney Function', 'KFT', 'Diagnostics'], views: 5430, likes: 345, comments: 12, featured: false
  },
  {
    id: 11, title: '5 Superfoods for a Healthy Heart', excerpt: 'Incorporate these heart-friendly superfoods into your diet for better cardiovascular health.', category: 'Nutrition',
    author: 'Dr. Arjun Mehta', date: 'Nov 20, 2024', readTime: '4 min', image: '🥑',
    tags: ['Heart Health', 'Superfoods', 'Diet'], views: 13500, likes: 978, comments: 63, featured: false
  },
  {
    id: 12, title: 'The Importance of Regular Health Checkups', excerpt: 'Annual health checkups can detect potential health issues early. Learn why prevention is better than cure.',
    category: 'Preventive Care', author: 'Dr. Priya Sharma', date: 'Nov 18, 2024', readTime: '3 min', image: '📅',
    tags: ['Checkups', 'Prevention', 'Health'], views: 8900, likes: 567, comments: 34, featured: false
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = articles.filter(a => {
    const matchCat = category === 'All' || a.category === category;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = articles.filter(a => a.featured);

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" /> Health Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Insights for a Healthier Life
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Expert health articles, tips, and insights from our medical professionals.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-slate-900 placeholder:text-gray-400 outline-none shadow-xl text-base" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {category === 'All' && !search && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }} className="card-premium overflow-hidden group">
                  <div className="h-40 gradient-primary flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                    {a.image}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{a.category}</span>
                    <h3 className="font-heading font-semibold text-slate-900 mt-2 mb-2 line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{a.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.views > 999 ? `${(a.views / 1000).toFixed(1)}k` : a.views}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === c ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:border-primary-300'
                }`}>{c}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-slate-500">No articles found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4 }} className="card-premium overflow-hidden group">
                  <div className="h-36 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-4xl">
                    {a.image}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{a.category}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-slate-900 text-sm mb-2 line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{a.excerpt}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author.split(' ')[1]}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10 text-sm text-slate-400">
            Showing {filtered.length} of {articles.length} articles
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-white">
        <div className="container-premium max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card-premium p-8">              <Mail className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold text-slate-900 mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-sm text-slate-500 mb-6">Get the latest health tips and updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="input-field flex-1" />
              <button className="btn-primary px-6 shrink-0">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}



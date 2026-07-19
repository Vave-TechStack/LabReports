'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, truncate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  image: string | null;
  tags: string[];
  publishedAt: string;
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiService.blogs.getAll({ limit: 3 });
        setPosts(response.data?.data || []);
      } catch { /* */ }
    };
    fetchBlogs();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Health Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Latest Health Articles
          </h2>
          <p className="text-lg text-slate-600">
            Expert health advice, lab test guides, and wellness tips from our medical professionals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/blog/${post.slug}`} className="block card-premium overflow-hidden group">
                <div className="h-48 gradient-card flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{truncate(post.excerpt, 120)}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/blog" className="inline-flex items-center gap-2 btn-outline font-semibold px-8 py-3.5">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

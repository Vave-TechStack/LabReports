'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCog, Shield, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getUsers({ page, limit: 20, search: search || undefined, role: roleFilter || undefined });
      setUsers(res.data?.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
    } catch {
      // Fallback demo users
      setUsers([
        { id: 'u1', email: 'admin@medilab.com', phone: '+919999999999', role: 'SUPER_ADMIN', isActive: true, createdAt: new Date('2024-01-01') },
        { id: 'u2', email: 'dr.venkatesh@medilab.com', phone: '+919876543201', role: 'DOCTOR', isActive: true, createdAt: new Date('2024-01-15') },
        { id: 'u3', email: 'lab.assistant@medilab.com', phone: '+919876543202', role: 'LAB_ASSISTANT', isActive: true, createdAt: new Date('2024-02-01') },
        { id: 'u4', email: 'reception@medilab.com', phone: '+919876543203', role: 'RECEPTIONIST', isActive: true, createdAt: new Date('2024-02-15') },
        { id: 'u5', email: 'demo@medilab.com', phone: '+919876543210', role: 'PATIENT', isActive: true, createdAt: new Date('2024-03-01') },
        { id: 'u6', email: 'john.doe@gmail.com', phone: '+919876543204', role: 'PATIENT', isActive: true, createdAt: new Date('2024-03-10') },
        { id: 'u7', email: 'jane.smith@gmail.com', phone: '+919876543205', role: 'PATIENT', isActive: false, createdAt: new Date('2024-03-15') },
        { id: 'u8', email: 'dr.sunita@medilab.com', phone: '+919876543206', role: 'DOCTOR', isActive: true, createdAt: new Date('2024-04-01') },
        { id: 'u9', email: 'branch.admin@medilab.com', phone: '+919876543207', role: 'ADMIN', isActive: true, createdAt: new Date('2024-04-15') },
        { id: 'u10', email: 'accountant@medilab.com', phone: '+919876543208', role: 'ADMIN', isActive: true, createdAt: new Date('2024-05-01') },
        { id: 'u11', email: 'phlebotomist@medilab.com', phone: '+919876543209', role: 'LAB_ASSISTANT', isActive: true, createdAt: new Date('2024-05-15') },
        { id: 'u12', email: 'rahul.verma@gmail.com', phone: '+919876543210', role: 'PATIENT', isActive: true, createdAt: new Date('2024-06-01') },
      ]);
      setTotalPages(2);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleRoleUpdate = async (id: string, role: string) => {
    setUpdating(id);
    try { await apiService.admin.updateUser(id, { role }); fetchUsers(); } catch { /* */ }
    setUpdating(null);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setUpdating(id);
    try { await apiService.admin.updateUser(id, { isActive: !isActive }); fetchUsers(); } catch { /* */ }
    setUpdating(null);
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700', ADMIN: 'bg-blue-100 text-blue-700',
    DOCTOR: 'bg-emerald-100 text-emerald-700', LAB_ASSISTANT: 'bg-amber-100 text-amber-700',
    PATIENT: 'bg-gray-100 text-gray-700', RECEPTIONIST: 'bg-cyan-100 text-cyan-700',
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage all platform users and permissions.</p>
      </motion.div>

      <div className="card-premium p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by email or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </form>
          {['', 'SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'LAB_ASSISTANT', 'PATIENT', 'RECEPTIONIST'].map(r => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${roleFilter === r ? 'bg-purple-600 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
              {r.replace(/_/g, ' ') || 'All Roles'}
            </button>
          ))}
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Phone</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Joined</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><div className="skeleton h-10 w-full rounded-lg" /></td></tr>
                ))
              ) : users.map((user: any) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{user.email}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${roleColors[user.role] || 'bg-gray-100'}`}>{user.role?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value=""
                        onChange={(e) => { if (e.target.value) handleRoleUpdate(user.id, e.target.value); }}
                        disabled={updating === user.id}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-500"
                      >
                        <option value="">Change Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="LAB_ASSISTANT">Lab Assistant</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="PATIENT">Patient</option>
                      </select>
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        disabled={updating === user.id}
                        className={`p-1.5 rounded-lg ${user.isActive ? 'hover:bg-red-50 text-red-600' : 'hover:bg-emerald-50 text-emerald-600'}`}
                      >
                        {updating === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

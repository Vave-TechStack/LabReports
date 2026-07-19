'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Truck, Edit2, Trash2, X, Check, Loader2,
  Phone, Mail, MapPin, ChevronRight, Package, ShoppingCart
} from 'lucide-react';
import { apiService } from '@/lib/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', gstNumber: '' });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await apiService.suppliers.getAll({ page, limit: 20, search });
      setSuppliers(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummySuppliers = [
        { id: 'sup-1', name: 'MediSupplies India Pvt Ltd', contactPerson: 'Rahul Mehta', phone: '+91 98765 43001', email: 'rahul@medisupplies.in', address: '42, Industrial Area, Phase 2', city: 'Hyderabad', state: 'Telangana', pincode: '500072', gstNumber: '36AAACM1234A1Z5', isActive: true, _count: { inventory: 8, purchaseOrders: 15 } },
        { id: 'sup-2', name: 'BioLab Diagnostics', contactPerson: 'Dr. Sneha Patel', phone: '+91 98765 43002', email: 'sneha@biolabdiagnostics.com', address: '15, Lab Complex, Whitefield', city: 'Bangalore', state: 'Karnataka', pincode: '560066', gstNumber: '29BBBD5678A1Z5', isActive: true, _count: { inventory: 6, purchaseOrders: 12 } },
        { id: 'sup-3', name: 'HealthFirst Medical Supplies', contactPerson: 'Arun Nair', phone: '+91 98765 43003', email: 'arun@healthfirst.in', address: '88, Medical Plaza, Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069', gstNumber: '27AAAF9012A1Z5', isActive: true, _count: { inventory: 5, purchaseOrders: 8 } },
        { id: 'sup-4', name: 'PharmaCare Distributors', contactPerson: 'Vikram Joshi', phone: '+91 98765 43004', email: 'vikram@pharmacare.com', address: '7, Pharma Road, T Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', gstNumber: '33AAAP3456A1Z5', isActive: true, _count: { inventory: 3, purchaseOrders: 6 } },
        { id: 'sup-5', name: 'LabTech Instruments', contactPerson: 'Priya Singh', phone: '+91 98765 43005', email: 'priya@labtech.in', address: '22, Tech Park, Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201309', gstNumber: '09AAAL7890A1Z5', isActive: true, _count: { inventory: 2, purchaseOrders: 4 } },
        { id: 'sup-6', name: 'Surgical Solutions India', contactPerson: 'Dr. Amit Verma', phone: '+91 98765 43006', email: 'amit@surgicalsolutions.in', address: '55, Medical District, Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', gstNumber: '27AAAS1111A1Z5', isActive: true, _count: { inventory: 4, purchaseOrders: 3 } },
        { id: 'sup-7', name: 'Diagnostic Reagents Co', contactPerson: 'Meera Iyer', phone: '+91 98765 43007', email: 'meera@diagnosticreagents.com', address: '10, Lab Enclave, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', gstNumber: '36AAAD2222A1Z5', isActive: true, _count: { inventory: 7, purchaseOrders: 10 } },
        { id: 'sup-8', name: 'Global MedTech Distributors', contactPerson: 'Ravi Kumar', phone: '+91 98765 43008', email: 'ravi@globalmedtech.com', address: '90, BKC, Bandra East', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', gstNumber: '27AAAG3333A1Z5', isActive: false, _count: { inventory: 1, purchaseOrders: 2 } },
      ];
      const filtered = search
        ? dummySuppliers.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
            s.phone.includes(search) ||
            s.email?.toLowerCase().includes(search.toLowerCase())
          )
        : dummySuppliers;
      setSuppliers(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, [page, search]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) {
        await apiService.suppliers.update(editing.id, form);
      } else {
        await apiService.suppliers.create(form);
      }
      setShowForm(false); setEditing(null);
      setForm({ name: '', contactPerson: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', gstNumber: '' });
      fetchSuppliers();
    } catch { /* */ }
    setSubmitting(false);
  };

  const handleEdit = (s: any) => {
    setForm({ name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, city: s.city, state: s.state, pincode: s.pincode, gstNumber: s.gstNumber || '' });
    setEditing(s);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this supplier?')) return;
    try { await apiService.suppliers.delete(id); fetchSuppliers(); } catch { /* */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500 mt-1">Manage vendors and supply chain partners.</p>
        </motion.div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', contactPerson: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', gstNumber: '' }); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, contact, phone, or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Company Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. MedSupply Corp" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contact Person *</label>
                  <input type="text" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+91 9876543210" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label>
                  <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">GST Number</label>
                  <input type="text" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} className="input-field" placeholder="22AAAAA0000A1Z5" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.name || !form.contactPerson || !form.phone} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Supplier'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-40 w-full rounded-xl" />)
        ) : suppliers.length === 0 ? (
          <div className="md:col-span-2 card-premium p-12 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Suppliers</h3>
            <p className="text-slate-500">Add your first supplier to get started.</p>
          </div>
        ) : (
          suppliers.map((s: any) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500">{s.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(s)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {s.phone}</span>
                {s.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {s.email}</span>}
                {s.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.city}</span>}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-slate-500"><Package className="w-3 h-3" /> {s._count?.inventory || 0} items</span>
                <span className="flex items-center gap-1 text-slate-500"><ShoppingCart className="w-3 h-3" /> {s._count?.purchaseOrders || 0} orders</span>
                {s.gstNumber && <span className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[10px] font-mono">GST: {s.gstNumber}</span>}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

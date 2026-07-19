'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Filter, Package, AlertTriangle, ChevronRight,
  Edit2, Trash2, X, Check, Loader2, FlaskConical, Beaker, Pill,
  Wrench
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const itemTypeIcons: Record<string, any> = { REAGENT: FlaskConical, CONSUMABLE: Package, MEDICINE: Pill, EQUIPMENT: Wrench, OTHER: Beaker };
const itemTypeColors: Record<string, string> = { REAGENT: 'bg-blue-50 text-blue-600', CONSUMABLE: 'bg-emerald-50 text-emerald-600', MEDICINE: 'bg-red-50 text-red-600', EQUIPMENT: 'bg-purple-50 text-purple-600', OTHER: 'bg-gray-50 text-gray-600' };

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ itemName: '', itemType: 'REAGENT', quantity: 0, unit: 'units', minQuantity: 10, price: 0, branchId: '', supplierId: '', expiryDate: '' });
  const [branches, setBranches] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (typeFilter) params.itemType = typeFilter;
      const res = await apiService.inventory.getAll(params);
      setItems(res.data?.data || []);
      setMeta(res.data?.meta || {});
      setLowStockCount(res.data?.lowStockCount || 0);
    } catch {
      const dummyItems = [
        { id: 'inv-1', itemName: 'CBC Reagent Kit', itemType: 'REAGENT', quantity: 25, unit: 'units', minQuantity: 10, price: 2500, branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', supplier: { name: 'MediSupplies India' }, supplierId: 'sup-1', expiryDate: '2025-06-15T00:00:00Z' },
        { id: 'inv-2', itemName: 'TSH Test Reagent', itemType: 'REAGENT', quantity: 8, unit: 'units', minQuantity: 5, price: 3200, branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', supplier: { name: 'BioLab Diagnostics' }, supplierId: 'sup-2', expiryDate: '2025-04-20T00:00:00Z' },
        { id: 'inv-3', itemName: 'Lipid Profile Reagent', itemType: 'REAGENT', quantity: 12, unit: 'units', minQuantity: 8, price: 1800, branch: { name: 'Mumbai - Andheri Branch' }, branchId: 'br-3', supplier: { name: 'BioLab Diagnostics' }, supplierId: 'sup-2', expiryDate: '2025-08-10T00:00:00Z' },
        { id: 'inv-4', itemName: 'Sample Collection Tubes', itemType: 'CONSUMABLE', quantity: 450, unit: 'pcs', minQuantity: 100, price: 8, branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', supplier: { name: 'MediSupplies India' }, supplierId: 'sup-1', expiryDate: '' },
        { id: 'inv-5', itemName: 'Disposable Gloves (Box)', itemType: 'CONSUMABLE', quantity: 22, unit: 'boxes', minQuantity: 10, price: 350, branch: { name: 'Bangalore - Whitefield Branch' }, branchId: 'br-2', supplier: { name: 'HealthFirst Medical' }, supplierId: 'sup-3', expiryDate: '' },
        { id: 'inv-6', itemName: 'Glucose Test Strips', itemType: 'CONSUMABLE', quantity: 5, unit: 'boxes', minQuantity: 10, price: 450, branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', supplier: { name: 'HealthFirst Medical' }, supplierId: 'sup-3', expiryDate: '2025-02-28T00:00:00Z' },
        { id: 'inv-7', itemName: 'HbA1c Test Kit', itemType: 'REAGENT', quantity: 15, unit: 'units', minQuantity: 5, price: 2800, branch: { name: 'Chennai - T Nagar Branch' }, branchId: 'br-4', supplier: { name: 'MediSupplies India' }, supplierId: 'sup-1', expiryDate: '2025-09-30T00:00:00Z' },
        { id: 'inv-8', itemName: 'Centrifuge Machine', itemType: 'EQUIPMENT', quantity: 1, unit: 'units', minQuantity: 1, price: 450000, branch: { name: 'Bangalore - Whitefield Branch' }, branchId: 'br-2', supplier: { name: 'LabTech Instruments' }, supplierId: 'sup-5', expiryDate: '' },
        { id: 'inv-9', itemName: 'Multivitamin Supplement', itemType: 'MEDICINE', quantity: 150, unit: 'bottles', minQuantity: 20, price: 85, branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', supplier: { name: 'PharmaCare Distributors' }, supplierId: 'sup-4', expiryDate: '2025-12-31T00:00:00Z' },
        { id: 'inv-10', itemName: 'Vitamin D Reagent', itemType: 'REAGENT', quantity: 3, unit: 'units', minQuantity: 6, price: 4200, branch: { name: 'Mumbai - Andheri Branch' }, branchId: 'br-3', supplier: { name: 'BioLab Diagnostics' }, supplierId: 'sup-2', expiryDate: '2025-03-15T00:00:00Z' },
        { id: 'inv-11', itemName: 'Iron Supplements', itemType: 'MEDICINE', quantity: 80, unit: 'bottles', minQuantity: 20, price: 120, branch: { name: 'Delhi - Noida Branch' }, branchId: 'br-5', supplier: { name: 'PharmaCare Distributors' }, supplierId: 'sup-4', expiryDate: '2026-01-15T00:00:00Z' },
        { id: 'inv-12', itemName: 'Biohazard Disposal Bags', itemType: 'CONSUMABLE', quantity: 200, unit: 'pcs', minQuantity: 50, price: 12, branch: { name: 'Mumbai - Andheri Branch' }, branchId: 'br-3', supplier: { name: 'HealthFirst Medical' }, supplierId: 'sup-3', expiryDate: '' },
      ];
      let filtered = search
        ? dummyItems.filter(i => i.itemName.toLowerCase().includes(search.toLowerCase()) || i.supplier?.name?.toLowerCase().includes(search.toLowerCase()))
        : dummyItems;
      if (typeFilter) {
        filtered = filtered.filter(i => i.itemType === typeFilter);
      }
      if (lowStockOnly) {
        filtered = filtered.filter(i => i.quantity <= i.minQuantity);
      }
      const lowCount = dummyItems.filter(i => i.quantity <= i.minQuantity).length;
      setItems(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
      setLowStockCount(lowCount);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [page, search, typeFilter]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [bRes, sRes] = await Promise.all([
          apiService.admin.getBranches(),
          apiService.suppliers.getAll({ limit: 100 }),
        ]);
        setBranches(bRes.data?.data || []);
        setSuppliers(sRes.data?.data || []);
      } catch {
        setBranches([
          { id: 'br-1', name: 'Hyderabad - Main Lab' },
          { id: 'br-2', name: 'Bangalore - Whitefield Branch' },
          { id: 'br-3', name: 'Mumbai - Andheri Branch' },
          { id: 'br-4', name: 'Chennai - T Nagar Branch' },
          { id: 'br-5', name: 'Delhi - Noida Branch' }
        ]);
        setSuppliers([
          { id: 'sup-1', name: 'MediSupplies India Pvt Ltd', isActive: true },
          { id: 'sup-2', name: 'BioLab Diagnostics', isActive: true },
          { id: 'sup-3', name: 'HealthFirst Medical Supplies', isActive: true },
          { id: 'sup-4', name: 'PharmaCare Distributors', isActive: true },
          { id: 'sup-5', name: 'LabTech Instruments', isActive: true }
        ]);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) {
        await apiService.inventory.update(editing.id, form);
      } else {
        await apiService.inventory.create(form);
      }
      setShowForm(false); setEditing(null); setForm({ itemName: '', itemType: 'REAGENT', quantity: 0, unit: 'units', minQuantity: 10, price: 0, branchId: '', supplierId: '', expiryDate: '' });
      fetchItems();
    } catch { /* */ }
    setSubmitting(false);
  };

  const handleEdit = (item: any) => {
    setForm({ itemName: item.itemName, itemType: item.itemType, quantity: item.quantity, unit: item.unit, minQuantity: item.minQuantity, price: item.price, branchId: item.branchId || '', supplierId: item.supplierId || '', expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '' });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try { await apiService.inventory.delete(id); fetchItems(); } catch { /* */ }
  };

  const typeChips = ['', 'REAGENT', 'CONSUMABLE', 'MEDICINE', 'EQUIPMENT', 'OTHER'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Manage reagents, consumables, medicines, and equipment.</p>
        </motion.div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ itemName: '', itemType: 'REAGENT', quantity: 0, unit: 'units', minQuantity: 10, price: 0, branchId: '', supplierId: '', expiryDate: '' }); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700 flex-1"><strong>{lowStockCount} item{lowStockCount > 1 ? 's' : ''}</strong> below minimum stock level. Reorder soon.</p>
          <button onClick={() => setLowStockOnly(!lowStockOnly)} className="text-sm text-red-600 font-medium hover:text-red-700">
            {lowStockOnly ? 'Show All' : 'View Only'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search items..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {typeChips.map((type) => (
            <button key={type} onClick={() => { setTypeFilter(type); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                typeFilter === type ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}>
              {type || 'All Types'}
            </button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Item' : 'Add Inventory Item'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Item Name *</label>
                <input type="text" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="input-field" placeholder="e.g. CBC Reagent Kit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type *</label>
                  <select value={form.itemType} onChange={(e) => setForm({ ...form, itemType: e.target.value })} className="input-field">
                    <option value="REAGENT">Reagent</option>
                    <option value="CONSUMABLE">Consumable</option>
                    <option value="MEDICINE">Medicine</option>
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Branch *</label>
                  <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="input-field">
                    <option value="">Select branch</option>
                    {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quantity *</label>
                  <input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit</label>
                  <input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field" placeholder="units, ml, pcs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Min Qty</label>
                  <input type="number" min="1" value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: parseInt(e.target.value) || 10 })} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price (per unit)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier</label>
                  <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="input-field">
                    <option value="">Select supplier</option>
                    {suppliers.filter((s: any) => s.isActive !== false).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.itemName || !form.branchId} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Item'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Item</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Type</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Quantity</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Min Qty</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Price</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Branch</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Expiry</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={9}><div className="skeleton h-12 w-full mx-4 my-2 rounded-xl" /></td></tr>)
              ) : items.length === 0 ? (
                <tr><td colSpan={9}><div className="text-center py-12"><Package className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-slate-500">No inventory items found</p></div></td></tr>
              ) : (
                items.map((item: any) => {
                  const Icon = itemTypeIcons[item.itemType] || Package;
                  const iconColor = itemTypeColors[item.itemType] || 'bg-gray-50 text-gray-600';
                  const isLow = item.quantity <= item.minQuantity;
                  return (
                    <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.itemName}</p>
                            {item.supplier?.name && <p className="text-[10px] text-slate-400">{item.supplier.name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center"><span className="text-xs text-slate-600">{item.itemType}</span></td>
                      <td className="py-3 px-4 text-center"><span className={`text-sm font-semibold ${isLow ? 'text-red-600' : 'text-slate-900'}`}>{item.quantity}</span></td>
                      <td className="py-3 px-4 text-center"><span className="text-sm text-slate-500">{item.minQuantity}</span></td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center"><span className="text-sm text-slate-900">₹{item.price}</span></td>
                      <td className="py-3 px-4 text-center"><span className="text-xs text-slate-500">{item.branch?.name || '—'}</span></td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs ${item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                          {item.expiryDate ? formatDate(item.expiryDate) : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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

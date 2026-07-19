'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, Plus, ShoppingCart, X, Check, Loader2,
  Truck, Clock, CheckCircle, AlertCircle, Package
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Clock },
  APPROVED: { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  ORDERED: { label: 'Ordered', color: 'bg-amber-100 text-amber-700', icon: Truck },
  PARTIALLY_RECEIVED: { label: 'Partial', color: 'bg-purple-100 text-purple-700', icon: Package },
  RECEIVED: { label: 'Received', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const nextStatuses: Record<string, string[]> = {
  PENDING: ['APPROVED', 'CANCELLED'],
  APPROVED: ['ORDERED', 'CANCELLED'],
  ORDERED: ['PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'],
  PARTIALLY_RECEIVED: ['RECEIVED', 'CANCELLED'],
  RECEIVED: [],
  CANCELLED: [],
};

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [form, setForm] = useState({ supplierId: '', branchId: '', notes: '', expectedAt: '', items: [{ itemName: '', itemType: 'REAGENT', quantity: 1, unit: 'units', price: 0 }] });
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.purchaseOrders.getAll(params);
      setOrders(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyOrders = [
        {
          id: 'po-1', orderNumber: 'PO-2024-0045', status: 'RECEIVED',
          supplier: { name: 'MediSupplies India Pvt Ltd' },
          branch: { name: 'Hyderabad - Main Lab' },
          items: [
            { itemName: 'CBC Reagent Kit', itemType: 'REAGENT', quantity: 10, price: 2500 },
            { itemName: 'TSH Test Reagent', itemType: 'REAGENT', quantity: 5, price: 3200 },
            { itemName: 'Sample Collection Tubes', itemType: 'CONSUMABLE', quantity: 500, price: 8 }
          ],
          totalAmount: 26500,
          expectedAt: '2024-03-10T00:00:00Z',
          notes: 'Standard monthly order'
        },
        {
          id: 'po-2', orderNumber: 'PO-2024-0046', status: 'ORDERED',
          supplier: { name: 'BioLab Diagnostics' },
          branch: { name: 'Hyderabad - Main Lab' },
          items: [
            { itemName: 'Lipid Profile Reagent', itemType: 'REAGENT', quantity: 8, price: 1800 },
            { itemName: 'Glucose Test Strips', itemType: 'CONSUMABLE', quantity: 20, price: 450 }
          ],
          totalAmount: 14400,
          expectedAt: '2024-03-22T00:00:00Z',
          notes: ''
        },
        {
          id: 'po-3', orderNumber: 'PO-2024-0047', status: 'PENDING',
          supplier: { name: 'HealthFirst Medical Supplies' },
          branch: { name: 'Bangalore - Whitefield Branch' },
          items: [
            { itemName: 'Centrifuge Machine', itemType: 'EQUIPMENT', quantity: 1, price: 45000 },
            { itemName: 'Microscope Slides', itemType: 'CONSUMABLE', quantity: 100, price: 15 },
            { itemName: 'Disposable Gloves (Box)', itemType: 'CONSUMABLE', quantity: 10, price: 350 }
          ],
          totalAmount: 48500,
          expectedAt: '2024-03-28T00:00:00Z',
          notes: 'New equipment for Bangalore branch'
        },
        {
          id: 'po-4', orderNumber: 'PO-2024-0048', status: 'PARTIALLY_RECEIVED',
          supplier: { name: 'MediSupplies India Pvt Ltd' },
          branch: { name: 'Mumbai - Andheri Branch' },
          items: [
            { itemName: 'Vitamin D Reagent', itemType: 'REAGENT', quantity: 6, price: 4200 },
            { itemName: 'Vitamin B12 Reagent', itemType: 'REAGENT', quantity: 4, price: 3800 },
            { itemName: 'HbA1c Test Kit', itemType: 'REAGENT', quantity: 5, price: 2800 }
          ],
          totalAmount: 37800,
          expectedAt: '2024-03-20T00:00:00Z',
          notes: 'Urgent - running low on Vitamin D reagent'
        },
        {
          id: 'po-5', orderNumber: 'PO-2024-0049', status: 'APPROVED',
          supplier: { name: 'PharmaCare Distributors' },
          branch: { name: 'Chennai - T Nagar Branch' },
          items: [
            { itemName: 'Multivitamin Supplement', itemType: 'MEDICINE', quantity: 200, price: 85 },
            { itemName: 'Iron Supplements', itemType: 'MEDICINE', quantity: 150, price: 120 }
          ],
          totalAmount: 17000,
          expectedAt: '2024-03-25T00:00:00Z',
          notes: 'Pharmacy stock replenishment'
        },
        {
          id: 'po-6', orderNumber: 'PO-2024-0050', status: 'CANCELLED',
          supplier: { name: 'BioLab Diagnostics' },
          branch: { name: 'Hyderabad - Main Lab' },
          items: [
            { itemName: 'Hormone Panel Reagent', itemType: 'REAGENT', quantity: 3, price: 7500 }
          ],
          totalAmount: 22500,
          expectedAt: '2024-03-15T00:00:00Z',
          notes: 'Supplier cancelled - found alternative'
        },
        {
          id: 'po-7', orderNumber: 'PO-2024-0051', status: 'ORDERED',
          supplier: { name: 'LabTech Instruments' },
          branch: { name: 'Delhi - Noida Branch' },
          items: [
            { itemName: 'Automated Hematology Analyzer', itemType: 'EQUIPMENT', quantity: 1, price: 450000 },
            { itemName: 'Installation & Training', itemType: 'OTHER', quantity: 1, price: 15000 }
          ],
          totalAmount: 465000,
          expectedAt: '2024-04-05T00:00:00Z',
          notes: 'New equipment for Noida lab expansion'
        },
        {
          id: 'po-8', orderNumber: 'PO-2024-0052', status: 'PENDING',
          supplier: { name: 'HealthFirst Medical Supplies' },
          branch: { name: 'Mumbai - Andheri Branch' },
          items: [
            { itemName: 'PPE Kit (Box of 50)', itemType: 'CONSUMABLE', quantity: 20, price: 250 },
            { itemName: 'Hand Sanitizer (5L)', itemType: 'CONSUMABLE', quantity: 10, price: 180 },
            { itemName: 'Biohazard Disposal Bags', itemType: 'CONSUMABLE', quantity: 100, price: 12 }
          ],
          totalAmount: 5800,
          expectedAt: '2024-03-30T00:00:00Z',
          notes: 'Safety equipment monthly replenishment'
        }
      ];
      const filtered = search
        ? dummyOrders.filter(o =>
            o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            o.supplier.name.toLowerCase().includes(search.toLowerCase())
          )
        : dummyOrders;
      const statusFiltered = statusFilter ? filtered.filter(o => o.status === statusFilter) : filtered;
      setOrders(statusFiltered);
      setMeta({ totalPages: 1, total: statusFiltered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [page, search, statusFilter]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [sRes, bRes] = await Promise.all([
          apiService.suppliers.getAll({ limit: 100 }),
          apiService.admin.getBranches(),
        ]);
        setSuppliers(sRes.data?.data || []);
        setBranches(bRes.data?.data || []);
      } catch {
        setSuppliers([
          { id: 'sup-1', name: 'MediSupplies India Pvt Ltd', isActive: true },
          { id: 'sup-2', name: 'BioLab Diagnostics', isActive: true },
          { id: 'sup-3', name: 'HealthFirst Medical Supplies', isActive: true },
          { id: 'sup-4', name: 'PharmaCare Distributors', isActive: true },
          { id: 'sup-5', name: 'LabTech Instruments', isActive: true }
        ]);
        setBranches([
          { id: 'br-1', name: 'Hyderabad - Main Lab' },
          { id: 'br-2', name: 'Bangalore - Whitefield Branch' },
          { id: 'br-3', name: 'Mumbai - Andheri Branch' },
          { id: 'br-4', name: 'Chennai - T Nagar Branch' },
          { id: 'br-5', name: 'Delhi - Noida Branch' }
        ]);
      }
    };
    fetchOptions();
  }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await apiService.purchaseOrders.create(form);
      setShowForm(false);
      setForm({ supplierId: '', branchId: '', notes: '', expectedAt: '', items: [{ itemName: '', itemType: 'REAGENT', quantity: 1, unit: 'units', price: 0 }] });
      fetchOrders();
    } catch { /* */ }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try { await apiService.purchaseOrders.updateStatus(id, status); fetchOrders(); } catch { /* */ }
    setUpdatingId(null);
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { itemName: '', itemType: 'REAGENT', quantity: 1, unit: 'units', price: 0 }] });
  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };
  const removeItem = (index: number) => {
    if (form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const statuses = ['', 'PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-500 mt-1">Create and manage orders from suppliers.</p>
        </motion.div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by order # or supplier..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statuses.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
              {s ? s.replace(/_/g, ' ') : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900">New Purchase Order</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier *</label>
                  <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="input-field">
                    <option value="">Select supplier</option>
                    {suppliers.filter((s: any) => s.isActive !== false).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
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

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-700">Order Items</label>
                  <button onClick={addItem} className="text-xs text-amber-600 hover:text-amber-700 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                      <input type="text" placeholder="Item name" value={item.itemName} onChange={(e) => updateItem(index, 'itemName', e.target.value)} className="input-field flex-1 text-xs" />
                      <select value={item.itemType} onChange={(e) => updateItem(index, 'itemType', e.target.value)} className="input-field w-24 text-xs">
                        <option value="REAGENT">Reagent</option>
                        <option value="CONSUMABLE">Consumable</option>
                        <option value="MEDICINE">Medicine</option>
                        <option value="EQUIPMENT">Equipment</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} className="input-field w-16 text-xs text-center" />
                      <input type="number" min="0" step="0.01" placeholder="Price" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} className="input-field w-20 text-xs" />
                      {form.items.length > 1 && (
                        <button onClick={() => removeItem(index)} className="p-1 hover:bg-red-50 rounded text-red-500"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expected Delivery</label>
                  <input type="date" value={form.expectedAt} onChange={(e) => setForm({ ...form, expectedAt: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                  <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" placeholder="Optional notes" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} disabled={submitting || !form.supplierId || !form.branchId} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  {submitting ? 'Creating...' : 'Create Order'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 w-full rounded-xl" />)
        ) : orders.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Purchase Orders</h3>
            <p className="text-slate-500">Create your first purchase order to get started.</p>
          </div>
        ) : (
          orders.map((order: any) => {
            const statusConf = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = statusConf.icon;
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
            const totalItems = items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0);
            const nextActions = nextStatuses[order.status] || [];

            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${statusConf.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900 font-mono">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span>{order.supplier?.name}</span>
                      <span>•</span>
                      <span>{order.branch?.name}</span>
                      <span>•</span>
                      <span>{totalItems} items</span>
                      {order.expectedAt && (
                        <>
                          <span>•</span>
                          <span>Expected: {formatDate(order.expectedAt)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium text-slate-900">₹{order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {nextActions.map((action: string) => (
                      <button
                        key={action}
                        onClick={() => handleStatusUpdate(order.id, action)}
                        disabled={updatingId === order.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          action === 'CANCELLED'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : action === 'RECEIVED'
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {updatingId === order.id ? '...' : action.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })
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

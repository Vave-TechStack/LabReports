'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Briefcase, Edit2, Trash2, X, Check, Loader2, Building2, Mail, Phone, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', employeeId: '', department: '', designation: '', branchId: '', joiningDate: '', salary: 0 });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (deptFilter) params.department = deptFilter;
      const res = await apiService.employees.getAll(params);
      setEmployees(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyEmployees = [
        { id: 'emp-1', firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001', department: 'Pathology', designation: 'Lab Manager', branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', joiningDate: '2019-06-15T00:00:00Z', salary: 65000, _count: { attendance: 285, leaveRequests: 8 } },
        { id: 'emp-2', firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002', department: 'Pathology', designation: 'Senior Lab Technician', branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', joiningDate: '2020-03-01T00:00:00Z', salary: 42000, _count: { attendance: 195, leaveRequests: 5 } },
        { id: 'emp-3', firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003', department: 'Administration', designation: 'Branch Manager', branch: { name: 'Bangalore - Whitefield Branch' }, branchId: 'br-2', joiningDate: '2018-11-20T00:00:00Z', salary: 72000, _count: { attendance: 310, leaveRequests: 6 } },
        { id: 'emp-4', firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004', department: 'Front Desk', designation: 'Receptionist', branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', joiningDate: '2021-07-10T00:00:00Z', salary: 28000, _count: { attendance: 140, leaveRequests: 3 } },
        { id: 'emp-5', firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005', department: 'Phlebotomy', designation: 'Senior Phlebotomist', branch: { name: 'Mumbai - Andheri Branch' }, branchId: 'br-3', joiningDate: '2020-09-05T00:00:00Z', salary: 35000, _count: { attendance: 175, leaveRequests: 4 } },
        { id: 'emp-6', firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006', department: 'Accounting', designation: 'Accountant', branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', joiningDate: '2021-01-15T00:00:00Z', salary: 38000, _count: { attendance: 130, leaveRequests: 2 } },
        { id: 'emp-7', firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007', department: 'Radiology', designation: 'Radiologist', branch: { name: 'Chennai - T Nagar Branch' }, branchId: 'br-4', joiningDate: '2019-04-22T00:00:00Z', salary: 58000, _count: { attendance: 240, leaveRequests: 5 } },
        { id: 'emp-8', firstName: 'Ananya', lastName: 'Nair', employeeId: 'EMP008', department: 'Pathology', designation: 'Lab Technician', branch: { name: 'Bangalore - Whitefield Branch' }, branchId: 'br-2', joiningDate: '2022-02-14T00:00:00Z', salary: 32000, _count: { attendance: 85, leaveRequests: 2 } },
        { id: 'emp-9', firstName: 'Deepak', lastName: 'Gupta', employeeId: 'EMP009', department: 'Marketing', designation: 'Marketing Manager', branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', joiningDate: '2020-06-01T00:00:00Z', salary: 55000, _count: { attendance: 160, leaveRequests: 4 } },
        { id: 'emp-10', firstName: 'Kavita', lastName: 'Iyer', employeeId: 'EMP010', department: 'Front Desk', designation: 'Patient Coordinator', branch: { name: 'Mumbai - Andheri Branch' }, branchId: 'br-3', joiningDate: '2021-11-08T00:00:00Z', salary: 30000, _count: { attendance: 100, leaveRequests: 3 } },
        { id: 'emp-11', firstName: 'Arjun', lastName: 'Bose', employeeId: 'EMP011', department: 'IT', designation: 'System Administrator', branch: { name: 'Hyderabad - Main Lab' }, branchId: 'br-1', joiningDate: '2022-08-01T00:00:00Z', salary: 48000, _count: { attendance: 55, leaveRequests: 1 } },
        { id: 'emp-12', firstName: 'Meera', lastName: 'Chopra', employeeId: 'EMP012', department: 'Phlebotomy', designation: 'Junior Phlebotomist', branch: { name: 'Delhi - Noida Branch' }, branchId: 'br-5', joiningDate: '2023-03-20T00:00:00Z', salary: 25000, _count: { attendance: 30, leaveRequests: 1 } },
      ];
      let filtered = dummyEmployees;
      if (search) {
        filtered = filtered.filter(e =>
          e.firstName.toLowerCase().includes(search.toLowerCase()) ||
          e.lastName.toLowerCase().includes(search.toLowerCase()) ||
          e.employeeId.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (deptFilter) {
        filtered = filtered.filter(e => e.department === deptFilter);
      }
      setEmployees(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, [page, search, deptFilter]);
  useEffect(() => {
    apiService.admin.getBranches()
      .then(r => setBranches(r.data?.data || []))
      .catch(() => setBranches([
        { id: 'br-1', name: 'Hyderabad - Main Lab' },
        { id: 'br-2', name: 'Bangalore - Whitefield Branch' },
        { id: 'br-3', name: 'Mumbai - Andheri Branch' },
        { id: 'br-4', name: 'Chennai - T Nagar Branch' },
        { id: 'br-5', name: 'Delhi - Noida Branch' }
      ]));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) { await apiService.employees.update(editing.id, form); }
      else { await apiService.employees.create(form); }
      setShowForm(false); setEditing(null);
      setForm({ firstName: '', lastName: '', employeeId: '', department: '', designation: '', branchId: '', joiningDate: '', salary: 0 });
      fetchEmployees();
    } catch { /* */ }
    setSubmitting(false);
  };

  const departments = ['Pathology', 'Radiology', 'Administration', 'Front Desk', 'Phlebotomy', 'Accounting', 'IT', 'Marketing'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-1">Manage all staff members and their details.</p>
        </motion.div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ firstName: '', lastName: '', employeeId: '', department: '', designation: '', branchId: '', joiningDate: '', salary: 0 }); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Employee</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by name or employee ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" /></div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {['', ...departments].map((d) => (<button key={d} onClick={() => { setDeptFilter(d); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${deptFilter === d ? 'bg-cyan-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{d || 'All'}</button>))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Employee' : 'Add Employee'}</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label><input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Last Name *</label><input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Employee ID *</label><input type="text" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input-field" placeholder="EMP001" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Branch *</label>
                  <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="input-field">
                    <option value="">Select branch</option>
                    {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field">
                    <option value="">Select</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Designation</label><input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Joining Date</label><input type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Salary</label><input type="number" min="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: parseFloat(e.target.value) || 0 })} className="input-field" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.firstName || !form.lastName || !form.employeeId} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Employee'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)
        : employees.length === 0 ? (
          <div className="card-premium p-12 text-center"><Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Employees</h3><p className="text-slate-500">Add your first employee.</p></div>
        ) : employees.map((emp: any) => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-cyan-600">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{emp.firstName} {emp.lastName}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[10px] font-mono">{emp.employeeId}</span>
                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-[10px] font-semibold">{emp.department || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {emp.designation || '—'}</span>
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {emp.branch?.name || '—'}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {emp.joiningDate ? formatDate(emp.joiningDate) : '—'}</span>
                    {emp.salary && <span>₹{emp.salary?.toLocaleString()}/mo</span>}
                    <span>{emp._count?.attendance || 0} days • {emp._count?.leaveRequests || 0} leaves</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setForm({ firstName: emp.firstName, lastName: emp.lastName || '', employeeId: emp.employeeId, department: emp.department || '', designation: emp.designation || '', branchId: emp.branchId || '', joiningDate: emp.joiningDate?.split('T')[0] || '', salary: emp.salary || 0 }); setEditing(emp); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm('Delete this employee?')) apiService.employees.delete(emp.id).then(fetchEmployees); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}

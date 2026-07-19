'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sun, Moon, Sunrise, Sunset, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const shiftTypeIcons: Record<string, any> = { MORNING: Sunrise, AFTERNOON: Sun, NIGHT: Moon, GENERAL: Sunset };
const shiftTypeColors: Record<string, string> = { MORNING: 'bg-amber-50 text-amber-600', AFTERNOON: 'bg-orange-50 text-orange-600', NIGHT: 'bg-indigo-50 text-indigo-600', GENERAL: 'bg-cyan-50 text-cyan-600' };
const shiftTypes = ['MORNING', 'AFTERNOON', 'NIGHT', 'GENERAL'];

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employeeId: '', date: '', type: 'GENERAL', startTime: '09:00', endTime: '17:00', notes: '' });

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await apiService.employees.getShifts({ date, limit: 100 });
      setShifts(res.data?.data || []);
    } catch {
      setEmployees([
        { id: 'emp-1', firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001', department: 'Pathology' },
        { id: 'emp-2', firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002', department: 'Pathology' },
        { id: 'emp-3', firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003', department: 'Administration' },
        { id: 'emp-4', firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004', department: 'Front Desk' },
        { id: 'emp-5', firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005', department: 'Phlebotomy' },
        { id: 'emp-6', firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006', department: 'Accounting' },
        { id: 'emp-7', firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007', department: 'Radiology' },
        { id: 'emp-8', firstName: 'Ananya', lastName: 'Nair', employeeId: 'EMP008', department: 'Pathology' },
        { id: 'emp-9', firstName: 'Deepak', lastName: 'Gupta', employeeId: 'EMP009', department: 'Marketing' },
        { id: 'emp-10', firstName: 'Kavita', lastName: 'Iyer', employeeId: 'EMP010', department: 'Front Desk' },
        { id: 'emp-11', firstName: 'Arjun', lastName: 'Bose', employeeId: 'EMP011', department: 'IT' },
        { id: 'emp-12', firstName: 'Meera', lastName: 'Chopra', employeeId: 'EMP012', department: 'Phlebotomy' },
      ]);
      const dummyShifts = [
        { id: 'sh-1', employee: { firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001', department: 'Pathology' }, type: 'MORNING', startTime: '06:00', endTime: '14:00', notes: '' },
        { id: 'sh-2', employee: { firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002', department: 'Pathology' }, type: 'GENERAL', startTime: '09:00', endTime: '17:00', notes: 'Covering for Ananya' },
        { id: 'sh-3', employee: { firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003', department: 'Administration' }, type: 'GENERAL', startTime: '09:00', endTime: '18:00', notes: '' },
        { id: 'sh-4', employee: { firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004', department: 'Front Desk' }, type: 'MORNING', startTime: '07:00', endTime: '15:00', notes: 'Early shift' },
        { id: 'sh-5', employee: { firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005', department: 'Phlebotomy' }, type: 'AFTERNOON', startTime: '14:00', endTime: '22:00', notes: 'Afternoon collection duty' },
        { id: 'sh-6', employee: { firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006', department: 'Accounting' }, type: 'GENERAL', startTime: '09:30', endTime: '17:30', notes: '' },
        { id: 'sh-7', employee: { firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007', department: 'Radiology' }, type: 'MORNING', startTime: '08:00', endTime: '16:00', notes: '' },
        { id: 'sh-8', employee: { firstName: 'Deepak', lastName: 'Gupta', employeeId: 'EMP009', department: 'Marketing' }, type: 'GENERAL', startTime: '10:00', endTime: '18:00', notes: 'Late start due to meeting' },
        { id: 'sh-9', employee: { firstName: 'Kavita', lastName: 'Iyer', employeeId: 'EMP010', department: 'Front Desk' }, type: 'AFTERNOON', startTime: '15:00', endTime: '23:00', notes: '' },
        { id: 'sh-10', employee: { firstName: 'Arjun', lastName: 'Bose', employeeId: 'EMP011', department: 'IT' }, type: 'GENERAL', startTime: '09:00', endTime: '17:00', notes: 'On-call support' },
      ];
      setShifts(dummyShifts);
    }
    setLoading(false);
  };

  useEffect(() => { fetchShifts(); }, [date]);
  useEffect(() => {
    apiService.employees.getAll({ limit: 200 })
      .then(r => setEmployees(r.data?.data || []))
      .catch(() => setEmployees([
        { id: 'emp-1', firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001', department: 'Pathology' },
        { id: 'emp-2', firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002', department: 'Pathology' },
        { id: 'emp-3', firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003', department: 'Administration' },
        { id: 'emp-4', firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004', department: 'Front Desk' },
        { id: 'emp-5', firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005', department: 'Phlebotomy' },
        { id: 'emp-6', firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006', department: 'Accounting' },
        { id: 'emp-7', firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007', department: 'Radiology' },
        { id: 'emp-8', firstName: 'Ananya', lastName: 'Nair', employeeId: 'EMP008', department: 'Pathology' },
        { id: 'emp-9', firstName: 'Deepak', lastName: 'Gupta', employeeId: 'EMP009', department: 'Marketing' },
        { id: 'emp-10', firstName: 'Kavita', lastName: 'Iyer', employeeId: 'EMP010', department: 'Front Desk' },
        { id: 'emp-11', firstName: 'Arjun', lastName: 'Bose', employeeId: 'EMP011', department: 'IT' },
        { id: 'emp-12', firstName: 'Meera', lastName: 'Chopra', employeeId: 'EMP012', department: 'Phlebotomy' },
      ]));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await apiService.employees.assignShift({ ...form, date }); setShowForm(false); setForm({ employeeId: '', date: '', type: 'GENERAL', startTime: '09:00', endTime: '17:00', notes: '' }); fetchShifts(); } catch { /* */ }
    setSubmitting(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Shift Scheduling</h1>
        <p className="text-slate-500 mt-1">Assign and manage employee shifts.</p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
          <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d.toISOString().split('T')[0]); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field !border-0 !ring-0 text-center w-36" />
          <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d.toISOString().split('T')[0]); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
          {date !== todayStr && <button onClick={() => setDate(todayStr)} className="text-xs text-cyan-600 font-medium px-2">Today</button>}
        </div>
        <span className="text-sm text-slate-500">{shifts.length} shifts assigned</span>
        <div className="ml-auto"><button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Sun className="w-4 h-4" /> Assign Shift</button></div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">Assign Shift</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Employee *</label>
                <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input-field"><option value="">Select employee</option>{employees.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeId})</option>)}</select>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Shift Type</label>
                <div className="flex gap-2">{shiftTypes.map((t) => {
                  const Icon = shiftTypeIcons[t];
                  return (<button key={t} onClick={() => setForm({ ...form, type: t })} className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${form.type === t ? `${shiftTypeColors[t]} shadow-sm` : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}><Icon className="w-3.5 h-3.5" /> {t}</button>);
                })}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Start Time *</label><input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">End Time *</label><input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.employeeId} className="btn-primary flex-1 flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}{submitting ? 'Assigning...' : 'Assign Shift'}</button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)
        : shifts.length === 0 ? (
          <div className="card-premium p-12 text-center"><Sun className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Shifts</h3><p className="text-slate-500">No shifts assigned for this date.</p></div>
        ) : shifts.map((s: any) => {
          const Icon = shiftTypeIcons[s.type] || Sun;
          const color = shiftTypeColors[s.type] || 'bg-gray-50 text-gray-600';
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{s.employee?.firstName} {s.employee?.lastName}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[10px] font-mono">{s.employee?.employeeId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${color}`}>{s.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{s.startTime} - {s.endTime}</span>
                    <span>•</span>
                    <span>{s.employee?.department || '—'}</span>
                    {s.notes && <><span>•</span><span>{s.notes}</span></>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, CheckCircle, XCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params: any = { date, limit: 100 };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.employees.getAttendance(params);
      setRecords(res.data?.data || []);
    } catch {
      const dummyEmployees = [
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
      ];
      setEmployees(dummyEmployees);
      const dummyRecords = [
        { employeeId: 'emp-1', status: 'PRESENT', checkIn: `${date}T09:05:00Z`, checkOut: `${date}T17:30:00Z` },
        { employeeId: 'emp-2', status: 'PRESENT', checkIn: `${date}T08:55:00Z`, checkOut: `${date}T17:15:00Z` },
        { employeeId: 'emp-3', status: 'LATE', checkIn: `${date}T09:45:00Z`, checkOut: `${date}T17:00:00Z` },
        { employeeId: 'emp-4', status: 'PRESENT', checkIn: `${date}T09:00:00Z`, checkOut: `${date}T18:00:00Z` },
        { employeeId: 'emp-5', status: 'ABSENT' },
        { employeeId: 'emp-6', status: 'HALF_DAY', checkIn: `${date}T09:10:00Z`, checkOut: `${date}T13:00:00Z` },
        { employeeId: 'emp-7', status: 'PRESENT', checkIn: `${date}T08:50:00Z`, checkOut: `${date}T17:20:00Z` },
        { employeeId: 'emp-8', status: 'PRESENT', checkIn: `${date}T09:02:00Z`, checkOut: `${date}T17:45:00Z` },
        { employeeId: 'emp-9', status: 'LATE', checkIn: `${date}T09:30:00Z`, checkOut: `${date}T17:00:00Z` },
        { employeeId: 'emp-10', status: 'PRESENT', checkIn: `${date}T08:58:00Z`, checkOut: `${date}T17:10:00Z` },
        { employeeId: 'emp-11', status: 'PRESENT', checkIn: `${date}T09:01:00Z`, checkOut: `${date}T17:35:00Z` },
        { employeeId: 'emp-12', status: 'ABSENT' },
      ];
      const filtered = statusFilter ? dummyRecords.filter(r => r.status === statusFilter) : dummyRecords;
      setRecords(filtered);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAttendance(); }, [date, statusFilter]);

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

  const markAttendance = async (employeeId: string, status: string) => {
    try {
      await apiService.employees.markAttendance({ employeeId, date, status });
      fetchAttendance();
    } catch { /* */ }
  };

  const employeeMap = new Map(employees.map((e: any) => [e.id, e]));
  const todayStr = new Date().toISOString().split('T')[0];
  const statusOptions = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-500 mt-1">Mark daily attendance for all employees.</p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
          <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d.toISOString().split('T')[0]); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field !border-0 !ring-0 text-center w-36" />
          <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d.toISOString().split('T')[0]); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
          {date !== todayStr && <button onClick={() => setDate(todayStr)} className="text-xs text-cyan-600 font-medium px-2">Today</button>}
        </div>
        <div className="flex items-center gap-2">
          {['', 'PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-cyan-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{s || 'All'}</button>
          ))}
        </div>
        <span className="text-sm text-slate-500 ml-auto">{records.length} records</span>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Department</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Check In</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Check Out</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 8 }).map((_, i) => <tr key={i}><td colSpan={7}><div className="skeleton h-10 w-full mx-4 my-2 rounded-xl" /></td></tr>)
              : employees.length === 0 ? <tr><td colSpan={7}><div className="text-center py-12"><Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-slate-500">No employees found</p></div></td></tr>
              : employees.map((emp: any) => {
                  const record = records.find((r: any) => r.employeeId === emp.id);
                  const status = record?.status || '—';
                  return (
                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-cyan-600">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">{emp.firstName} {emp.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className="text-xs font-mono text-slate-500">{emp.employeeId}</span></td>
                      <td className="py-3 px-4"><span className="text-xs text-slate-600">{emp.department || '—'}</span></td>
                      <td className="py-3 px-4 text-center"><span className="text-xs text-slate-600">{record?.checkIn ? formatDate(record.checkIn) : '—'}</span></td>
                      <td className="py-3 px-4 text-center"><span className="text-xs text-slate-600">{record?.checkOut ? formatDate(record.checkOut) : '—'}</span></td>
                      <td className="py-3 px-4 text-center">
                        {record ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : status === 'ABSENT' ? 'bg-red-100 text-red-700' : status === 'LATE' ? 'bg-amber-100 text-amber-700' : status === 'HALF_DAY' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{status}</span>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {statusOptions.map(s => (
                            <button key={s} onClick={() => markAttendance(emp.id, s)}
                              className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${record?.status === s ? (s === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : s === 'ABSENT' ? 'bg-red-100 text-red-700' : s === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700') : 'bg-gray-50 text-slate-400 hover:bg-gray-100'}`}>
                              {s === 'PRESENT' ? 'P' : s === 'ABSENT' ? 'A' : s === 'LATE' ? 'L' : 'H'}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

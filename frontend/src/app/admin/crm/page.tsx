'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Target, Headphones, CalendarRange, Megaphone, Users,
  CheckCircle, Clock, AlertCircle, ArrowRight, ChevronRight,
  MessageSquare, TrendingUp
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function CrmDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.crm.getStats();
        setStats(res.data?.data);
      } catch {
        setStats({
          totalLeads: 248,
          newLeadsToday: 12,
          openTickets: 5,
          urgentTickets: 2,
          pendingFollowUps: 18,
          activeCampaigns: 3,
          recentLeads: [
            { id: 'lead-1', firstName: 'Ravi', lastName: 'Kumar', source: 'WEBSITE', status: 'NEW', createdAt: '2024-03-18T10:30:00Z' },
            { id: 'lead-2', firstName: 'Sneha', lastName: 'Patel', source: 'REFERRAL', status: 'CONTACTED', createdAt: '2024-03-18T09:15:00Z' },
            { id: 'lead-3', firstName: 'Amit', lastName: 'Sharma', source: 'SOCIAL_MEDIA', status: 'QUALIFIED', createdAt: '2024-03-17T14:00:00Z' },
            { id: 'lead-4', firstName: 'Pooja', lastName: 'Reddy', source: 'CAMPAIGN', status: 'NEW', createdAt: '2024-03-17T11:30:00Z' },
            { id: 'lead-5', firstName: 'Vijay', lastName: 'Singh', source: 'WALK_IN', status: 'CONVERTED', createdAt: '2024-03-16T16:45:00Z' }
          ],
          recentTickets: [
            { id: 'tkt-1', subject: 'Report delivery delayed', ticketNumber: 'TKT-2024-0101', priority: 'HIGH', status: 'IN_PROGRESS', _count: { messages: 3 } },
            { id: 'tkt-2', subject: 'Billing discrepancy for package', ticketNumber: 'TKT-2024-0102', priority: 'URGENT', status: 'OPEN', _count: { messages: 1 } },
            { id: 'tkt-3', subject: 'Appointment rescheduling request', ticketNumber: 'TKT-2024-0103', priority: 'MEDIUM', status: 'RESOLVED', _count: { messages: 4 } },
            { id: 'tkt-4', subject: 'Test result not showing online', ticketNumber: 'TKT-2024-0104', priority: 'HIGH', status: 'OPEN', _count: { messages: 2 } },
          ],
          upcomingFollowUps: [
            { id: 'fu-1', title: 'Call back about health package', dueDate: '2024-03-19T10:00:00Z', lead: { firstName: 'Ravi', lastName: 'Kumar' } },
            { id: 'fu-2', title: 'Follow up on test booking', dueDate: '2024-03-19T14:00:00Z', lead: { firstName: 'Sneha', lastName: 'Patel' } },
            { id: 'fu-3', title: 'Send campaign brochure', dueDate: '2024-03-20T09:00:00Z', lead: { firstName: 'Amit', lastName: 'Sharma' } },
            { id: 'fu-4', title: 'Thank you call to converted lead', dueDate: '2024-03-18T16:00:00Z', lead: { firstName: 'Vijay', lastName: 'Singh' } },
          ]
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Leads', value: stats?.totalLeads, color: 'bg-blue-50 text-blue-600', href: '/admin/crm/leads' },
    { icon: TrendingUp, label: 'New Today', value: stats?.newLeadsToday, color: 'bg-emerald-50 text-emerald-600', href: '/admin/crm/leads' },
    { icon: Headphones, label: 'Open Tickets', value: stats?.openTickets, color: 'bg-amber-50 text-amber-600', href: '/admin/crm/tickets' },
    { icon: AlertCircle, label: 'Urgent', value: stats?.urgentTickets, color: 'bg-red-50 text-red-600', href: '/admin/crm/tickets?priority=URGENT' },
    { icon: CalendarRange, label: 'Pending Follow-Ups', value: stats?.pendingFollowUps, color: 'bg-purple-50 text-purple-600', href: '/admin/crm/follow-ups' },
    { icon: Megaphone, label: 'Active Campaigns', value: stats?.activeCampaigns, color: 'bg-rose-50 text-rose-600', href: '/admin/crm/campaigns' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">CRM Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage leads, support tickets, follow-ups, and campaigns.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-premium p-5"><div className="skeleton h-20 w-full rounded-xl" /></div>)
        ) : (
          statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={stat.href} className="card-premium p-5 block group hover:shadow-lg transition-all">
                <div className={`w-9 h-9 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-heading font-bold text-slate-900">{stat.value ?? '—'}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Leads</h2>
            <Link href="/admin/crm/leads" className="text-sm text-rose-600 hover:text-rose-700 font-medium">View All <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
          </div>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          ) : stats?.recentLeads?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No leads yet.</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentLeads?.map((lead: any) => (
                <div key={lead.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">{lead.firstName} {lead.lastName}</p>
                    <p className="text-[10px] text-slate-500">{lead.source} • {formatDate(lead.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'CONTACTED' ? 'bg-amber-100 text-amber-700' :
                    lead.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Tickets */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Open Tickets</h2>
            <Link href="/admin/crm/tickets" className="text-sm text-rose-600 hover:text-rose-700 font-medium">View All <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
          </div>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          ) : stats?.recentTickets?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No open tickets.</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentTickets?.map((ticket: any) => (
                <div key={ticket.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 ${
                    ticket.priority === 'URGENT' ? 'bg-red-50' :
                    ticket.priority === 'HIGH' ? 'bg-amber-50' : 'bg-blue-50'
                  } rounded-lg flex items-center justify-center shrink-0`}>
                    <MessageSquare className={`w-4 h-4 ${
                      ticket.priority === 'URGENT' ? 'text-red-600' :
                      ticket.priority === 'HIGH' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">{ticket.subject}</p>
                    <p className="text-[10px] text-slate-500">#{ticket.ticketNumber?.slice(-8)} • {ticket._count?.messages || 0} msgs</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                    ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Follow-Ups */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Upcoming Follow-Ups</h2>
            <Link href="/admin/crm/follow-ups" className="text-sm text-rose-600 hover:text-rose-700 font-medium">View All <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
          </div>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          ) : stats?.upcomingFollowUps?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No follow-ups pending.</p>
          ) : (
            <div className="space-y-2">
              {stats?.upcomingFollowUps?.map((fu: any) => (
                <div key={fu.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <CalendarRange className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">{fu.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {fu.lead ? `${fu.lead.firstName} ${fu.lead.lastName}` : ''} • {formatDate(fu.dueDate)}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    new Date(fu.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {new Date(fu.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

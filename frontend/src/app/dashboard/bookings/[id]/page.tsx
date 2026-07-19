'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, MapPin, CreditCard, FileText, 
  CheckCircle, Download, Eye, 
  AlertCircle, Check
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

interface BookingDetail {
  id: string;
  bookingNumber: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  address: string | null;
  notes: string | null;
  createdAt: string;
  bookingTests: { test: { id: string; name: string; code: string; category: { name: string } }; price: number }[];
  payments: { id: string; status: string; amount: number; gateway: string }[];
  report: { id: string; reportNumber: string; pdfUrl: string | null; isVerified: boolean } | null;
  invoice: { id: string; invoiceNumber: string; totalAmount: number; isPaid: boolean } | null;
  patient: { firstName: string; lastName: string; phone: string };
}

const statusFlow = [
  { key: 'PENDING', label: 'Booking Pending' },
  { key: 'CONFIRMED', label: 'Booking Confirmed' },
  { key: 'SAMPLE_COLLECTED', label: 'Sample Collected' },
  { key: 'LAB_PROCESSING', label: 'Lab Processing' },
  { key: 'DOCTOR_VERIFICATION', label: 'Doctor Verification' },
  { key: 'REPORT_READY', label: 'Report Ready' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-300',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-300',
  SAMPLE_COLLECTED: 'bg-purple-100 text-purple-700 border-purple-300',
  LAB_PROCESSING: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  DOCTOR_VERIFICATION: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  REPORT_READY: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  DELIVERED: 'bg-green-100 text-green-700 border-green-300',
  CANCELLED: 'bg-red-100 text-red-700 border-red-300',
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiService.bookings.getById(params.id as string);
        setBooking(res.data?.data);
      } catch {
        // Fallback demo booking detail
        setBooking({
          id: params.id as string,
          bookingNumber: 'ML-2024-10892',
          status: 'REPORT_READY',
          totalAmount: 4200,
          discountAmount: 700,
          finalAmount: 3500,
          appointmentDate: new Date().toISOString(),
          appointmentTime: '09:00',
          type: 'HOME_COLLECTION',
          address: '42, 3rd Cross, Indiranagar, Bangalore - 560038',
          notes: 'Please collect samples before 10 AM',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          bookingTests: [
            { test: { id: 't1', name: 'Complete Blood Count (CBC)', code: 'CBC', category: { name: 'Hematology' } }, price: 350 },
            { test: { id: 't3', name: 'Fasting Blood Sugar (FBS)', code: 'FBS', category: { name: 'Diabetes' } }, price: 100 },
            { test: { id: 't5', name: 'Lipid Profile', code: 'LIPID', category: { name: 'Cardiology' } }, price: 399 },
          ],
          payments: [{ id: 'p1', status: 'SUCCESS', amount: 3500, gateway: 'RAZORPAY' }],
          report: { id: 'r1', reportNumber: 'RPT-2024-0892', pdfUrl: null, isVerified: true },
          invoice: { id: 'inv1', invoiceNumber: 'INV-2024-0892', totalAmount: 3500, isPaid: true },
          patient: { firstName: 'Demo', lastName: 'Patient', phone: '+919999999999' },
        });
      }
      setLoading(false);
    };
    fetchBooking();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <div className="card-premium p-6">
          <div className="skeleton h-4 w-1/3 mb-4" />
          <div className="skeleton h-20 w-full mb-4" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="card-premium p-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-slate-900 mb-2">Booking not found</h3>
        <Link href="/dashboard/bookings" className="text-primary-600 hover:text-primary-700 font-medium">Back to bookings</Link>
      </div>
    );
  }

  const currentStepIndex = statusFlow.findIndex(s => s.key === booking.status);

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Booking Details</h1>
            <p className="text-sm text-primary-600 font-mono mt-1">{booking.bookingNumber}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusColors[booking.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {booking.status.replace(/_/g, ' ')}
          </span>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-6">Booking Status</h2>
            <div className="relative">
              {statusFlow.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                        isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < statusFlow.length - 1 && (
                        <div className={`w-0.5 h-8 ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className={`pt-1 ${isCurrent ? 'text-slate-900 font-medium' : isCompleted ? 'text-slate-600' : 'text-gray-400'}`}>
                      <p className="text-sm">{step.label}</p>
                      {isCurrent && (
                        <span className="text-xs text-primary-600">Current status</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tests */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Tests Included</h2>
            <div className="space-y-3">
              {booking.bookingTests.map((bt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{bt.test.name}</p>
                    <p className="text-xs text-slate-500">{bt.test.code} • {bt.test.category?.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(bt.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Appointment Info */}
          <div className="card-premium p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Appointment</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-slate-600">{formatDate(booking.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-slate-600">{booking.appointmentTime}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-slate-600">{booking.type === 'AT_CLINIC' ? 'At Lab' : 'Home Collection'}</span>
              </div>
              {booking.address && (
                <p className="text-sm text-slate-600 ml-7">{booking.address}</p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="card-premium p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Payment</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">{formatCurrency(booking.totalAmount)}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600">-{formatCurrency(booking.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                <span className="text-slate-900">Total</span>
                <span className="text-primary-700">{formatCurrency(booking.finalAmount)}</span>
              </div>
            </div>
            {booking.payments?.map(p => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                {p.status === 'SUCCESS' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-slate-600">{p.gateway} • {formatCurrency(p.amount)}</span>
                <span className={`ml-auto ${p.status === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}`}>{p.status}</span>
              </div>
            ))}

            {/* Pay Now button for pending payments */}
            {booking.status === 'PENDING' && (!booking.payments?.length || booking.payments.every(p => p.status !== 'SUCCESS')) && (
              <button
                onClick={async () => {
                  try {
                    const res = await apiService.payments.createOrder({ bookingId: booking.id, gateway: 'RAZORPAY' });
                    if (res.data.success) {
                      alert('Payment initiated! In production, this would redirect to the payment gateway.');
                      window.location.reload();
                    }
                  } catch {
                    alert('Payment initiation failed. Please try again.');
                  }
                }}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                <CreditCard className="w-4 h-4" /> Pay Now - {formatCurrency(booking.finalAmount)}
              </button>
            )}
          </div>

          {/* Report */}
          {booking.report && (
            <div className="card-premium p-6">
              <h3 className="font-heading font-semibold text-slate-900 mb-4">Report</h3>
              <p className="text-sm text-slate-600 mb-4">{booking.report.reportNumber}</p>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/reports/${booking.report.id}`}
                  className="flex-1 px-4 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View
                </Link>
                {booking.report.pdfUrl && (
                  <a
                    href={booking.report.pdfUrl}
                    target="_blank"
                    className="flex-1 px-4 py-2.5 bg-gray-50 text-slate-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Invoice */}
          {booking.invoice && (
            <div className="card-premium p-6">
              <h3 className="font-heading font-semibold text-slate-900 mb-2">Invoice</h3>
              <p className="text-sm text-slate-600">{booking.invoice.invoiceNumber}</p>
              <p className="text-lg font-bold text-slate-900 mt-2">{formatCurrency(booking.invoice.totalAmount)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

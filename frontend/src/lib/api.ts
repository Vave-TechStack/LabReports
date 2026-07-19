import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiService = {
  // Auth
  auth: {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    sendOTP: (phone: string) => api.post('/auth/send-otp', { phone }),
    verifyOTP: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
    refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
  },

  // Tests
  tests: {
    getAll: (params?: any) => api.get('/tests', { params }),
    getByCode: (code: string) => api.get(`/tests/${code}`),
    getPopular: () => api.get('/tests/popular'),
    getCategories: () => api.get('/tests/categories'),
    create: (data: any) => api.post('/tests', data),
    update: (id: string, data: any) => api.put(`/tests/${id}`, data),
    delete: (id: string) => api.delete(`/tests/${id}`),
  },

  // Packages
  packages: {
    getAll: (params?: any) => api.get('/packages', { params }),
    getBySlug: (slug: string) => api.get(`/packages/${slug}`),
    getPopular: () => api.get('/packages/popular'),
    create: (data: any) => api.post('/packages', data),
    update: (id: string, data: any) => api.put(`/packages/${id}`, data),
    delete: (id: string) => api.delete(`/packages/${id}`),
  },

  // Bookings
  bookings: {
    create: (data: any) => api.post('/bookings', data),
    getMyBookings: (params?: any) => api.get('/bookings/my-bookings', { params }),
    getById: (id: string) => api.get(`/bookings/${id}`),
    updateStatus: (id: string, status: string) => api.patch(`/bookings/${id}/status`, { status }),
  },

  // Patients
  patients: {
    getProfile: () => api.get('/patients/profile'),
    updateProfile: (data: any) => api.put('/patients/profile', data),
    getHistory: () => api.get('/patients/history'),
  },

  // Doctors
  doctors: {
    getAll: (params?: any) => api.get('/doctors', { params }),
    getSpecializations: () => api.get('/doctors/specializations'),
  },

  // Branches
  branches: {
    getAll: () => api.get('/branches'),
  },

  // Contact
  contact: {
    send: (data: any) => api.post('/contact', data),
  },

  // Blogs
  blogs: {
    getAll: (params?: any) => api.get('/blogs', { params }),
    getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
  },

  // Payments
  payments: {
    createOrder: (data: any) => api.post('/payments/create-order', data),
    verify: (data: any) => api.post('/payments/verify', data),
    getHistory: () => api.get('/payments/history'),
  },

  // Reports
  reports: {
    getMyReports: () => api.get('/reports/my-reports'),
    getById: (id: string) => api.get(`/reports/${id}`),
    create: (data: any) => api.post('/reports/create', data),
  },

  // Invoices
  invoices: {
    getMyInvoices: () => api.get('/invoices/my-invoices'),
  },

  // Admin
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getRevenue: (months?: number) => api.get(`/admin/revenue?months=${months || 12}`),
    getBookings: (params?: any) => api.get('/admin/bookings', { params }),
    getUsers: (params?: any) => api.get('/admin/users', { params }),
    updateUser: (id: string, data: any) => api.patch(`/admin/users/${id}`, data),
    getPatients: (params?: any) => api.get('/admin/patients', { params }),
    getBranches: () => api.get('/admin/branches'),
    createBranch: (data: any) => api.post('/admin/branches', data),
    updateBranch: (id: string, data: any) => api.put(`/admin/branches/${id}`, data),
    deleteBranch: (id: string) => api.delete(`/admin/branches/${id}`),
    getRecentBookings: (limit?: number) => api.get(`/admin/recent-bookings?limit=${limit || 10}`),
  },

  // Lab Assistant
  lab: {
    getDashboard: () => api.get('/lab/dashboard'),
    createSampleEntry: (data: any) => api.post('/lab/sample-entry', data),
    getBarcode: (barcode: string) => api.get(`/lab/barcode/${barcode}`),
    getPendingBookings: (params?: any) => api.get('/lab/pending-bookings', { params }),
    getPendingReports: (params?: any) => api.get('/lab/reports/pending', { params }),
    updateStatus: (id: string, status: string) => api.patch(`/lab/status/${id}`, { status }),
    getDoctors: () => api.get('/lab/doctors'),
    assignDoctor: (reportId: string, doctorId: string) => api.post('/lab/assign-doctor', { reportId, doctorId }),
    getPrintLabels: (id: string) => api.get(`/lab/print-labels/${id}`),
  },

  // Doctor Portal
  doctor: {
    getDashboard: () => api.get('/doctor/dashboard'),
    getPendingReports: (params?: any) => api.get('/doctor/pending-reports', { params }),
    getReports: (params?: any) => api.get('/doctor/reports', { params }),
    getReportById: (id: string) => api.get(`/doctor/reports/${id}`),
    verifyReport: (id: string, data?: any) => api.patch(`/doctor/reports/${id}/verify`, data),
    getPatients: (params?: any) => api.get('/doctor/patients', { params }),
    getPatientHistory: (id: string) => api.get(`/doctor/patients/${id}/history`),
    getSignature: () => api.get('/doctor/signature'),
    updateSignature: (signature: string) => api.post('/doctor/signature', { signature }),
    getPrescriptions: (params?: any) => api.get('/doctor/prescriptions', { params }),
  },

  // ERP - Inventory
  inventory: {
    getAll: (params?: any) => api.get('/inventory', { params }),
    getLowStock: () => api.get('/inventory/low-stock'),
    getStats: () => api.get('/inventory/stats'),
    create: (data: any) => api.post('/inventory', data),
    update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
    adjustQuantity: (id: string, adjustment: number) => api.patch(`/inventory/${id}/quantity`, { adjustment }),
    delete: (id: string) => api.delete(`/inventory/${id}`),
  },

  // ERP - Suppliers
  suppliers: {
    getAll: (params?: any) => api.get('/suppliers', { params }),
    create: (data: any) => api.post('/suppliers', data),
    update: (id: string, data: any) => api.put(`/suppliers/${id}`, data),
    delete: (id: string) => api.delete(`/suppliers/${id}`),
  },

  // ERP - Purchase Orders
  purchaseOrders: {
    getAll: (params?: any) => api.get('/purchase-orders', { params }),
    getById: (id: string) => api.get(`/purchase-orders/${id}`),
    create: (data: any) => api.post('/purchase-orders', data),
    updateStatus: (id: string, status: string) => api.patch(`/purchase-orders/${id}/status`, { status }),
  },

  // CRM
  crm: {
    getStats: () => api.get('/crm/stats'),
    getLeads: (params?: any) => api.get('/crm/leads', { params }),
    createLead: (data: any) => api.post('/crm/leads', data),
    updateLead: (id: string, data: any) => api.put(`/crm/leads/${id}`, data),
    updateLeadStatus: (id: string, status: string) => api.patch(`/crm/leads/${id}/status`, { status }),
    deleteLead: (id: string) => api.delete(`/crm/leads/${id}`),
    getTickets: (params?: any) => api.get('/crm/tickets', { params }),
    createTicket: (data: any) => api.post('/crm/tickets', data),
    getTicketById: (id: string) => api.get(`/crm/tickets/${id}`),
    updateTicketStatus: (id: string, status: string, resolution?: string) => api.patch(`/crm/tickets/${id}/status`, { status, resolution }),
    addTicketMessage: (id: string, data: any) => api.post(`/crm/tickets/${id}/messages`, data),
    getFollowUps: (params?: any) => api.get('/crm/follow-ups', { params }),
    createFollowUp: (data: any) => api.post('/crm/follow-ups', data),
    updateFollowUp: (id: string, data: any) => api.put(`/crm/follow-ups/${id}`, data),
    updateFollowUpStatus: (id: string, status: string) => api.patch(`/crm/follow-ups/${id}/status`, { status }),
    getCampaigns: (params?: any) => api.get('/crm/campaigns', { params }),
    createCampaign: (data: any) => api.post('/crm/campaigns', data),
    updateCampaign: (id: string, data: any) => api.put(`/crm/campaigns/${id}`, data),
    updateCampaignStatus: (id: string, status: string) => api.patch(`/crm/campaigns/${id}/status`, { status }),
    deleteCampaign: (id: string) => api.delete(`/crm/campaigns/${id}`),
  },

  // HR - Employees
  employees: {
    getAll: (params?: any) => api.get('/employees', { params }),
    create: (data: any) => api.post('/employees', data),
    update: (id: string, data: any) => api.put(`/employees/${id}`, data),
    delete: (id: string) => api.delete(`/employees/${id}`),
    getDashboard: () => api.get('/employees/dashboard'),
    getAttendance: (params?: any) => api.get('/employees/attendance', { params }),
    getTodayAttendance: () => api.get('/employees/attendance/today'),
    markAttendance: (data: any) => api.post('/employees/attendance/mark', data),
    getLeaves: (params?: any) => api.get('/employees/leaves', { params }),
    createLeave: (data: any) => api.post('/employees/leaves', data),
    updateLeaveStatus: (id: string, status: string, rejectionReason?: string) => api.patch(`/employees/leaves/${id}/status`, { status, rejectionReason }),
    getShifts: (params?: any) => api.get('/employees/shifts', { params }),
    assignShift: (data: any) => api.post('/employees/shifts', data),
    getPayroll: (params?: any) => api.get('/employees/payroll', { params }),
    processPayroll: (data: any) => api.post('/employees/payroll/process', data),
    markPayrollPaid: (id: string) => api.patch(`/employees/payroll/${id}/pay`, {}),
    getPayrollSummary: () => api.get('/employees/payroll/summary'),
  },

  // Accounting
  accounting: {
    getDashboard: () => api.get('/accounting/dashboard'),
    getExpenses: (params?: any) => api.get('/accounting/expenses', { params }),
    createExpense: (data: any) => api.post('/accounting/expenses', data),
    updateExpense: (id: string, data: any) => api.put(`/accounting/expenses/${id}`, data),
    deleteExpense: (id: string) => api.delete(`/accounting/expenses/${id}`),
    getInvoices: (params?: any) => api.get('/accounting/invoices', { params }),
    getProfitLoss: (months?: number) => api.get(`/accounting/profit-loss?months=${months || 12}`),
    getGstReport: (months?: number) => api.get(`/accounting/gst-report?months=${months || 3}`),
  },

  // Testimonials
  testimonials: {
    getFeatured: () => api.get('/testimonials'),
  },
};

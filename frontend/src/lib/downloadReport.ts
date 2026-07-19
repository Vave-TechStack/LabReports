/**
 * Client-side report download utility.
 * Generates a standalone, print-optimized HTML page for the report
 * and triggers the browser's "Save as PDF" print dialog.
 * Works entirely on the frontend without any backend dependency.
 */

interface PatientInfo {
  firstName: string;
  lastName: string;
  bloodGroup?: string | null;
  gender?: string | null;
}

interface BookingInfo {
  bookingNumber: string;
  appointmentDate?: string;
  type?: string;
  patient?: PatientInfo;
}

interface VerifierInfo {
  firstName: string;
  lastName: string;
  specialization?: string;
}

interface TestParameter {
  testId: string;
  testName: string;
  parameterName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

interface ReportDownloadData {
  id: string;
  reportNumber: string;
  isVerified: boolean;
  type?: string;
  createdAt: string;
  verifiedAt?: string | null;
  booking: BookingInfo;
  verifiedBy?: VerifierInfo | null;
  parameters?: TestParameter[];
  notes?: string | null;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function downloadReportPDF(report: ReportDownloadData): void {
  const params = report.parameters || [];

  // Group parameters by test name
  const grouped: Record<string, TestParameter[]> = {};
  for (const p of params) {
    if (!grouped[p.testName]) grouped[p.testName] = [];
    grouped[p.testName].push(p);
  }

  const patient = report.booking.patient;
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'N/A';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=800">
  <title>Report - ${report.reportNumber}</title>
  <style>
    @page { size: A4; margin: 18mm 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      font-size: 11px;
      line-height: 1.5;
      padding: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      border-bottom: 2px solid #0d9488;
      margin-bottom: 16px;
    }
    .header-left h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0f766e;
      letter-spacing: -0.3px;
    }
    .header-left p {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }
    .header-right {
      text-align: right;
    }
    .verified-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .verified-badge.verified { background: #d1fae5; color: #065f46; }
    .verified-badge.pending { background: #fef3c7; color: #92400e; }
    .report-number {
      font-size: 14px;
      font-weight: 700;
      color: #0d9488;
      margin-top: 4px;
      font-family: 'Courier New', monospace;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      margin-bottom: 16px;
    }
    .info-item label {
      display: block;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      color: #94a3b8;
      letter-spacing: 0.3px;
      margin-bottom: 1px;
    }
    .info-item span {
      display: block;
      font-size: 11px;
      font-weight: 500;
      color: #1e293b;
    }
    .test-section {
      margin-bottom: 14px;
    }
    .test-section h3 {
      font-size: 12px;
      font-weight: 700;
      color: #0f766e;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    thead th {
      text-align: left;
      padding: 5px 6px;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      background: #f1f5f9;
      border-bottom: 1px solid #cbd5e1;
    }
    thead th:last-child { text-align: center; }
    tbody td {
      padding: 4px 6px;
      border-bottom: 1px solid #f1f5f9;
    }
    tbody td:last-child { text-align: center; }
    .param-name { font-weight: 500; color: #1e293b; }
    .param-value { font-weight: 600; text-align: right; }
    .param-value.abnormal { color: #dc2626; }
    .param-value.normal { color: #1e293b; }
    .param-unit { text-align: center; color: #64748b; }
    .param-range { text-align: center; color: #64748b; }
    .status-normal {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: 600;
      background: #d1fae5;
      color: #065f46;
    }
    .status-abnormal {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: 600;
      background: #fee2e2;
      color: #991b1b;
    }
    .notes-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .notes-box h4 {
      font-size: 10px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 4px;
    }
    .notes-box p {
      font-size: 10px;
      color: #78350f;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      font-size: 8px;
      color: #94a3b8;
    }
    .footer p { margin-top: 2px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>MediLab Diagnostics</h1>
      <p>NABL Accredited Diagnostic Laboratory</p>
    </div>
    <div class="header-right">
      <div class="verified-badge ${report.isVerified ? 'verified' : 'pending'}">
        ${report.isVerified ? '✓ Verified Report' : '○ Pending Verification'}
      </div>
      <div class="report-number">${report.reportNumber}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-item">
      <label>Patient Name</label>
      <span>${patientName}</span>
    </div>
    ${patient?.bloodGroup ? `
    <div class="info-item">
      <label>Blood Group</label>
      <span>${patient.bloodGroup.replace(/_/g, ' ')}</span>
    </div>` : ''}
    ${report.booking.appointmentDate ? `
    <div class="info-item">
      <label>Report Date</label>
      <span>${formatDate(report.createdAt)}</span>
    </div>
    <div class="info-item">
      <label>Booking</label>
      <span>${report.booking.bookingNumber}</span>
    </div>` : `
    <div class="info-item">
      <label>Report Date</label>
      <span>${formatDate(report.createdAt)}</span>
    </div>
    <div class="info-item">
      <label>Booking</label>
      <span>${report.booking.bookingNumber}</span>
    </div>`}
    ${report.verifiedBy ? `
    <div class="info-item" style="grid-column: 1 / -1;">
      <label>Verified By</label>
      <span>Dr. ${report.verifiedBy.firstName} ${report.verifiedBy.lastName}${report.verifiedBy.specialization ? ` - ${report.verifiedBy.specialization}` : ''}</span>
    </div>` : ''}
  </div>

  ${Object.entries(grouped).map(([testName, params]) => `
  <div class="test-section">
    <h3>${testName}</h3>
    <table>
      <thead>
        <tr>
          <th style="width:34%">Parameter</th>
          <th style="width:14%;text-align:right">Result</th>
          <th style="width:16%;text-align:center">Unit</th>
          <th style="width:22%;text-align:center">Reference Range</th>
          <th style="width:14%;text-align:center">Status</th>
        </tr>
      </thead>
      <tbody>
        ${params.map(p => `
        <tr>
          <td class="param-name">${p.parameterName}</td>
          <td class="param-value ${p.isAbnormal ? 'abnormal' : 'normal'}">${p.value}</td>
          <td class="param-unit">${p.unit}</td>
          <td class="param-range">${p.referenceRange}</td>
          <td>
            ${p.isAbnormal
              ? '<span class="status-abnormal">Abnormal</span>'
              : '<span class="status-normal">Normal</span>'}
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`).join('')}

  ${report.notes ? `
  <div class="notes-box">
    <h4>Notes</h4>
    <p>${report.notes}</p>
  </div>` : ''}

  <div class="footer">
    <p>This is a computer-generated report. No signature is required.</p>
    <p>MediLab Diagnostics &bull; 1-98/8, Madhapur Main Road, Hyderabad - 500081</p>
  </div>
</body>
</html>`;

  // Open in new window and trigger browser print dialog (which has "Save as PDF" option)
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Wait for content to render, then show print dialog
    setTimeout(() => {
      printWindow.print();
    }, 600);
  } else {
    // Fallback if popup blocked: download as HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${report.reportNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

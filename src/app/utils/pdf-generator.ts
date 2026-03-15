// PDF generation utility for member statements
// This is a placeholder - actual implementation would use a library like jsPDF or html2pdf

export async function generatePDF(statementData: {
  member: {
    name: string;
    flatNumber: string;
    email: string;
    phone: string;
    monthlyAmount: number;
    houseType?: string;
    onboardingDate: string;
  };
  payments: Array<{
    id: string;
    amount: number;
    month?: string;
    paymentDate: string;
    paymentMode: string;
    transactionId?: string;
    paymentType: 'maintenance' | 'electricity';
  }>;
  pendingDues: {
    maintenanceDues: Array<{
      month: string;
      amount: number;
    }>;
    electricityArrear: number;
    totalPending: number;
  };
}) {
  // This would typically integrate with a PDF generation library
  // For now, we'll create a simple HTML representation that can be printed

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Create printable HTML content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Member Statement - ${statementData.member.name}</title>
  <style>
    @page { margin: 20mm; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #059669;
      margin: 0 0 10px 0;
      font-size: 32px;
    }
    .header p {
      color: #64748b;
      margin: 5px 0;
    }
    .member-info {
      background: #f0fdf4;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border: 2px solid #bbf7d0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      color: #064e3b;
    }
    .summary-section {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-box {
      flex: 1;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-box.paid {
      background: #d1fae5;
      border: 2px solid #6ee7b7;
    }
    .summary-box.pending {
      background: #fed7aa;
      border: 2px solid #fdba74;
    }
    .summary-box h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #64748b;
    }
    .summary-box .amount {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .summary-box.paid .amount {
      color: #059669;
    }
    .summary-box.pending .amount {
      color: #ea580c;
    }
    .section-title {
      font-size: 20px;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 20px;
      margin-top: 30px;
    }
    .pending-dues {
      background: #fef3c7;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 2px solid #fde68a;
    }
    .pending-months {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .month-badge {
      background: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #fbbf24;
      color: #92400e;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-weight: bold;
    }
    td {
      color: #334155;
    }
    .amount-cell {
      text-align: right;
      color: #059669;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>नालंदा टाउन / Nalanda Town</h1>
    <p>Premium Residential Society</p>
    <p>Member Statement / सदस्य विवरण</p>
  </div>

  <div class="member-info">
    <div class="info-row">
      <span class="info-label">Name / नाम:</span>
      <span>${statementData.member.name}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Flat Number / फ्लैट नंबर:</span>
      <span>${statementData.member.flatNumber}</span>
    </div>
    ${statementData.member.houseType ? `
    <div class="info-row">
      <span class="info-label">House Type / घर का प्रकार:</span>
      <span>${statementData.member.houseType}</span>
    </div>
    ` : ''}
    <div class="info-row">
      <span class="info-label">Monthly Amount / मासिक राशि:</span>
      <span>₹${statementData.member.monthlyAmount.toLocaleString()}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Email:</span>
      <span>${statementData.member.email}</span>
    </div>
    ${statementData.member.phone ? `
    <div class="info-row">
      <span class="info-label">Phone / फोन:</span>
      <span>${statementData.member.phone}</span>
    </div>
    ` : ''}
  </div>

  <div class="summary-section">
    <div class="summary-box paid">
      <h3>Total Paid / कुल भुगतान</h3>
      <p class="amount">₹${statementData.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
    </div>
    <div class="summary-box pending">
      <h3>Total Pending / कुल बकाया</h3>
      <p class="amount">₹${statementData.pendingDues.totalPending.toLocaleString()}</p>
    </div>
  </div>

  ${statementData.pendingDues.maintenanceDues.length > 0 ? `
  <div class="pending-dues">
    <h3 style="margin: 0 0 10px 0; color: #92400e;">Pending Maintenance Dues / बकाया रखरखाव शुल्क</h3>
    <div class="pending-months">
      ${statementData.pendingDues.maintenanceDues.map(due => `
        <span class="month-badge">${formatMonth(due.month)}: ₹${due.amount.toLocaleString()}</span>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${statementData.pendingDues.electricityArrear > 0 ? `
  <div class="pending-dues">
    <h3 style="margin: 0; color: #92400e;">Electricity Arrear / बिजली बकाया: ₹${statementData.pendingDues.electricityArrear.toLocaleString()}</h3>
  </div>
  ` : ''}

  <h2 class="section-title">Payment History / भुगतान इतिहास</h2>

  ${statementData.payments.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Date / तारीख</th>
        <th>Type / प्रकार</th>
        <th>Month / महीना</th>
        <th>Mode / माध्यम</th>
        <th style="text-align: right;">Amount / राशि</th>
      </tr>
    </thead>
    <tbody>
      ${statementData.payments.map(payment => `
        <tr>
          <td>${formatDate(payment.paymentDate)}</td>
          <td>${payment.paymentType === 'maintenance' ? 'Maintenance / रखरखाव' : 'Electricity / बिजली'}</td>
          <td>${payment.month ? formatMonth(payment.month) : '-'}</td>
          <td>${payment.paymentMode}</td>
          <td class="amount-cell">₹${payment.amount.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p style="text-align: center; color: #64748b; margin: 40px 0;">No payment history / कोई भुगतान इतिहास नहीं</p>'}

  <div class="footer">
    <p>Generated on / उत्पन्न: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    <p>Nalanda Town Society Management System</p>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 12px 24px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Print Statement</button>
    <button onclick="window.close()" style="padding: 12px 24px; background: #64748b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin-left: 10px;">Close</button>
  </div>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

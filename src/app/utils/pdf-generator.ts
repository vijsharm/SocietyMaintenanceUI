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
    electricityArrear?: number;
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
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatDateDDMMYYYY = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate due date (15th of next month from today)
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, 15);
  const dueDateStr = formatDateDDMMYYYY(dueDate.toISOString());

  // Get last payment info
  const maintenancePayments = statementData.payments
    .filter(p => p.paymentType === 'maintenance')
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

  const lastPayment = maintenancePayments[0];
  const lastPaymentDate = lastPayment ? formatDateDDMMYYYY(lastPayment.paymentDate) : 'N/A';
  const lastPaymentAmount = lastPayment ? lastPayment.amount : 0;

  // Calculate totals
  const pendingMonthsCount = statementData.pendingDues.maintenanceDues.length;
  const monthlyCharge = pendingMonthsCount * statementData.member.monthlyAmount;
  const lateFees = 0; // Late fees logic can be added if needed
  const subTotal = monthlyCharge + lateFees;
  const deduction = 0;
  const grossTotal = subTotal - deduction;
  const electricityArrear = statementData.pendingDues.electricityArrear || 0;
  const grossPay = grossTotal + electricityArrear;

  // Late fee after due date (₹10 per month)
  const lateFeesAfterDue = pendingMonthsCount * 10;
  const payableAfterDueDate = grossPay + lateFeesAfterDue;

  // Pending months list
  const pendingMonthsList = statementData.pendingDues.maintenanceDues
    .map(due => formatMonth(due.month))
    .join(', ');

  // Number to words conversion (basic implementation)
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num < 10) return ones[num];
    if (num >= 10 && num < 20) return teens[num - 10];
    if (num >= 20 && num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    }
    if (num >= 100 && num < 1000) {
      return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    }
    if (num >= 1000 && num < 100000) {
      return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    }
    if (num >= 100000) {
      return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    }
    return '';
  };

  const amountInWords = numberToWords(Math.floor(payableAfterDueDate)) + ' Rupees Only';

  // Create printable HTML content matching the exact PDF format
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nalanda Town Society Bill - ${statementData.member.name}</title>
  <style>
    @page {
      margin: 15mm;
      size: A4;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
      font-size: 13px;
      line-height: 1.4;
    }
    .header {
      text-align: center;
      margin-bottom: 15px;
    }
    .header h1 {
      font-size: 20px;
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 5px;
    }
    .header h2 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 3px;
    }
    .header p {
      font-size: 12px;
      margin-bottom: 2px;
    }
    .divider {
      border-bottom: 2px solid #000;
      margin: 10px 0;
    }
    .notice-box {
      border: 1px solid #000;
      padding: 10px;
      margin: 15px 0;
      background: #f9f9f9;
      font-size: 11px;
    }
    .pending-months-box {
      border: 2px solid #f59e0b;
      padding: 12px;
      margin: 15px 0;
      background: #fef3c7;
    }
    .pending-months-box p {
      font-weight: bold;
      font-size: 13px;
    }
    .info-section {
      display: table;
      width: 100%;
      margin: 10px 0;
    }
    .info-row {
      display: table-row;
    }
    .info-cell {
      display: table-cell;
      padding: 5px 10px;
      width: 50%;
      vertical-align: top;
    }
    .info-label {
      font-weight: bold;
      display: inline-block;
      width: 150px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table, th, td {
      border: 1px solid #000;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f0f0f0;
      font-weight: bold;
      text-align: center;
    }
    td {
      vertical-align: top;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .gross-pay-box {
      border: 2px solid #000;
      padding: 15px;
      margin: 15px 0;
    }
    .gross-pay-box p {
      margin: 5px 0;
      font-size: 13px;
    }
    .payable-box {
      border: 2px solid #000;
      padding: 15px;
      margin: 15px 0;
      text-align: center;
    }
    .payable-box h3 {
      font-size: 14px;
      margin-bottom: 5px;
    }
    .payable-box h2 {
      font-size: 18px;
      margin: 5px 0;
    }
    .other-due-box {
      border: 1px solid #000;
      padding: 15px;
      margin: 15px 0;
      min-height: 50px;
    }
    .footer-section {
      margin-top: 20px;
    }
    .footer-section p {
      margin: 8px 0;
    }
    .special-notice {
      border: 1px solid #000;
      padding: 10px;
      margin: 15px 0;
      background: #f9f9f9;
      font-size: 11px;
    }
    .footer-info {
      text-align: center;
      margin-top: 30px;
      font-size: 11px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>NALANDA TOWN, SHAMSHABAD ROAD, AGRA</h1>
    <h2>SOCIETY BILL</h2>
    <p>Generated on ${formatDate(new Date().toISOString())}</p>
  </div>

  <div class="divider"></div>

  <div class="notice-box">
    कृपया अपने बकाया बिल का भुगतान अंतिम तिथि <strong>${dueDateStr}</strong> तक करना सुनिश्चित करें। अन्यथा आपको दी जाने वाली सोसाइटी सुविधायें— पानी/सीवर/सफाई/घर से कूड़ा उठाना इत्यादि बन्द कर दिया जायेगा। इसके लिये आप स्वयं उत्तरदायी होंगे।
  </div>

  ${pendingMonthsCount > 0 ? `
  <div class="pending-months-box">
    <p>PENDING MONTHS (${pendingMonthsCount}):</p>
    <p style="font-weight: normal; margin-top: 5px;">${pendingMonthsList}</p>
  </div>
  ` : ''}

  <div class="info-section">
    <div class="info-row">
      <div class="info-cell">
        <span class="info-label">HOUSE NO:</span> ${statementData.member.flatNumber}
      </div>
      <div class="info-cell">
        <span class="info-label">Due Date:</span> ${dueDateStr}
      </div>
    </div>
    <div class="info-row">
      <div class="info-cell">
        <span class="info-label">NAME:</span> ${statementData.member.name}
      </div>
      <div class="info-cell">
        <span class="info-label">Late payment charge:</span> 10/- per month
      </div>
    </div>
    <div class="info-row">
      <div class="info-cell">
        <span class="info-label">Mob no-:</span> ${statementData.member.phone || 'N/A'}
      </div>
      <div class="info-cell">
        <span class="info-label">House Type:</span> ${statementData.member.houseType || 'N/A'}
      </div>
    </div>
    <div class="info-row">
      <div class="info-cell">
        <span class="info-label">Active Since:</span> ${formatDate(statementData.member.onboardingDate)}
      </div>
      <div class="info-cell">
        <span class="info-label">last payment date:</span> ${lastPaymentDate}
      </div>
    </div>
    <div class="info-row">
      <div class="info-cell"></div>
      <div class="info-cell">
        <span class="info-label">last payment Amount:</span> ${lastPaymentAmount}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;"></th>
        <th></th>
        <th style="width: 180px;">ELECTRIC ARREAR<br>UP TO NOV 2021</th>
        <th style="width: 180px;">SOCIETY & OTHER CHARGE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">1</td>
        <td>PREVIOUS BALANCE (ELECTRICITY)</td>
        <td class="text-right">${electricityArrear}</td>
        <td class="text-right">0</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>MONTHLY CHARGE (${statementData.member.monthlyAmount}/- × ${pendingMonthsCount} months)</td>
        <td class="text-right"></td>
        <td class="text-right">${monthlyCharge}</td>
      </tr>
      <tr>
        <td class="text-center">3</td>
        <td>LATE FEES</td>
        <td class="text-right"></td>
        <td class="text-right">${lateFees}</td>
      </tr>
      <tr>
        <td class="text-center">4</td>
        <td>SUB TOTAL (2+3)</td>
        <td class="text-right"></td>
        <td class="text-right">${subTotal}</td>
      </tr>
      <tr>
        <td class="text-center">5</td>
        <td>DEDUCTION</td>
        <td class="text-right"></td>
        <td class="text-right">${deduction}</td>
      </tr>
      <tr>
        <td class="text-center">6</td>
        <td>DETAIL DEDUCTION</td>
        <td class="text-right"></td>
        <td class="text-right"></td>
      </tr>
      <tr>
        <td class="text-center">7</td>
        <td>GROSS TOTAL</td>
        <td class="text-right"></td>
        <td class="text-right">${grossTotal}</td>
      </tr>
    </tbody>
  </table>

  <div class="gross-pay-box">
    <p><strong>GROSS PAY (Society + Electricity)</strong> <span style="float: right;">${grossPay}</span></p>
    <p style="margin-left: 20px;">Society Maintenance: ${pendingMonthsCount} months × ₹${statementData.member.monthlyAmount} <span style="float: right;">₹${monthlyCharge}</span></p>
    ${electricityArrear > 0 ? `<p style="margin-left: 20px;">Electricity Arrear <span style="float: right;">₹${electricityArrear}</span></p>` : ''}
  </div>

  <div class="payable-box">
    <h3>AFTER DUE DATE:- ${dueDateStr}</h3>
    <h2>PAYABLE Rs. ${payableAfterDueDate}</h2>
    <p style="font-size: 11px;">(Including late fee ₹${lateFeesAfterDue})</p>
  </div>

  <div class="other-due-box">
    <strong>OTHER DUE (if any):</strong>
  </div>

  <div class="footer-section">
    <p><strong>Amount in word:</strong> ${amountInWords}</p>
    <p style="margin-top: 15px;"><strong>Received amount:</strong> ___________________________</p>
    <p><strong>Balance:</strong> ___________________________</p>
    <p><strong>DATE & SIGN:</strong> ___________________________</p>
  </div>

  <div class="special-notice">
    <strong>विशेष सूचना—</strong> सोसाइटी शुल्क जमा करने की अंतिम तारीख <strong>${dueDateStr}</strong> है। उक्त तिथि तक शुल्क जमा न करने पर विलम्ब शुल्क रु0 <strong>10/—प्रति माह</strong> बिल में देय है।
  </div>

  <div class="footer-info">
    <p>Generated on ${formatDate(new Date().toISOString())} | Nalanda Town Society Management System</p>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 12px 24px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin-right: 10px;">Print Statement</button>
    <button onclick="window.close()" style="padding: 12px 24px; background: #64748b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Close</button>
  </div>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

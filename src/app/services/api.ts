// API Service Layer for Backend Integration
// Base URL for all API calls
const API_BASE_URL = 'https://societymaintenanceapi.onrender.com';

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Helper function for making authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // ApiCall: Handle JWT expiry - redirect to login on 401
  if (response.status === 401) {
    // JWT expired or invalid - clear auth and redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ==================== AUTH APIs ====================

// ApiCall: POST /api/auth/login
export async function loginAPI(username: string, password: string): Promise<{
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'readonly';
    name: string;
  };
}> {
  return fetchWithAuth('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ApiCall: POST /api/auth/logout
export async function logoutAPI(): Promise<void> {
  return fetchWithAuth('/api/auth/logout', {
    method: 'POST',
  });
}

// ==================== MEMBER APIs ====================

// ApiCall: GET /api/members
export async function getMembersAPI(): Promise<Array<{
  id: string;
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number;
  onboardingDate: string;
}>> {
  return fetchWithAuth('/api/members');
}

// ApiCall: GET /api/members/:id
export async function getMemberByIdAPI(id: string): Promise<{
  id: string;
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number;
  onboardingDate: string;
}> {
  return fetchWithAuth(`/api/members/${id}`);
}

// ApiCall: POST /api/members
export async function createMemberAPI(member: {
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number;
  onboardingDate: string;
}): Promise<{
  id: string;
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number;
  onboardingDate: string;
}> {
  return fetchWithAuth('/api/members', {
    method: 'POST',
    body: JSON.stringify(member),
  });
}

// ApiCall: PUT /api/members/:id
export async function updateMemberAPI(id: string, member: {
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number;
  onboardingDate: string;
}): Promise<{
  id: string;
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number;
  onboardingDate: string;
}> {
  return fetchWithAuth(`/api/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(member),
  });
}

// ApiCall: DELETE /api/members/:id
export async function deleteMemberAPI(id: string): Promise<void> {
  return fetchWithAuth(`/api/members/${id}`, {
    method: 'DELETE',
  });
}

// ==================== PAYMENT APIs ====================

// ApiCall: GET /api/payments
export async function getPaymentsAPI(params?: {
  memberId?: string;
  month?: string;
  paymentType?: 'maintenance' | 'electricity';
}): Promise<Array<{
  id: string;
  memberId: string;
  amount: number;
  month?: string;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  paymentType: 'maintenance' | 'electricity';
}>> {
  const queryParams = new URLSearchParams();
  if (params?.memberId) queryParams.append('memberId', params.memberId);
  if (params?.month) queryParams.append('month', params.month);
  if (params?.paymentType) queryParams.append('paymentType', params.paymentType);
  
  const query = queryParams.toString();
  return fetchWithAuth(`/api/payments${query ? `?${query}` : ''}`);
}

// ApiCall: POST /api/payments
export async function createPaymentAPI(payment: {
  memberId: string;
  amount: number;
  month?: string;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  paymentType: 'maintenance' | 'electricity';
}): Promise<{
  id: string;
  memberId: string;
  amount: number;
  month?: string;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  paymentType: 'maintenance' | 'electricity';
}> {
  return fetchWithAuth('/api/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  });
}

// ApiCall: DELETE /api/payments/:id
export async function deletePaymentAPI(id: string): Promise<void> {
  return fetchWithAuth(`/api/payments/${id}`, {
    method: 'DELETE',
  });
}

// ==================== EXPENDITURE APIs ====================

// ApiCall: GET /api/expenditures
export async function getExpendituresAPI(): Promise<Array<{
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}>> {
  return fetchWithAuth('/api/expenditures');
}

// ApiCall: POST /api/expenditures
// APIChange: Added 'addedBy' field to capture who added the expenditure
export async function createExpenditureAPI(expenditure: {
  description: string;
  amount: number;
  date: string;
  category: string;
  addedBy: string;
}): Promise<{
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  addedBy: string;
}> {
  return fetchWithAuth('/api/expenditures', {
    method: 'POST',
    body: JSON.stringify(expenditure),
  });
}

// ApiCall: PUT /api/expenditures/:id
// APIChange: Added 'addedBy' field to update expenditure
export async function updateExpenditureAPI(id: string, expenditure: {
  description: string;
  amount: number;
  date: string;
  category: string;
  addedBy: string;
}): Promise<{
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  addedBy: string;
}> {
  return fetchWithAuth(`/api/expenditures/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenditure),
  });
}

// ApiCall: DELETE /api/expenditures/:id
export async function deleteExpenditureAPI(id: string): Promise<void> {
  return fetchWithAuth(`/api/expenditures/${id}`, {
    method: 'DELETE',
  });
}

// ==================== STATISTICS / DASHBOARD APIs ====================

// ApiCall: GET /api/statistics/dashboard
export async function getDashboardStatsAPI(): Promise<{
  totalMembers: number;
  collectedThisMonth: number;
  expectedThisMonth: number;
  pendingThisMonth: number;
  paymentsThisMonth: number;
  societyBalance: number;
  totalExpenditure: number;
  totalPendingAllMonths: number;
}> {
  return fetchWithAuth('/api/statistics/dashboard');
}

// ApiCall: GET /api/statistics/pending-dues
export async function getPendingDuesAPI(): Promise<Array<{
  memberId: string;
  memberName: string;
  flatNumber: string;
  pendingMonths: Array<{
    month: string;
    amount: number;
  }>;
  electricityArrear: number;
  totalPending: number;
}>> {
  return fetchWithAuth('/api/statistics/pending-dues');
}

// ApiCall: GET /api/statistics/reports
export async function getReportsDataAPI(params?: {
  startMonth?: string;
  endMonth?: string;
}): Promise<{
  monthlyCollection: Array<{
    month: string;
    collected: number;
    expected: number;
    pending: number;
  }>;
  memberPaymentStatus: Array<{
    memberId: string;
    memberName: string;
    flatNumber: string;
    paidMonths: number;
    pendingMonths: number;
    totalPaid: number;
    totalPending: number;
  }>;
}> {
  const queryParams = new URLSearchParams();
  if (params?.startMonth) queryParams.append('startMonth', params.startMonth);
  if (params?.endMonth) queryParams.append('endMonth', params.endMonth);
  
  const query = queryParams.toString();
  return fetchWithAuth(`/api/statistics/reports${query ? `?${query}` : ''}`);
}

// ==================== SOCIETY BALANCE APIs ====================

// ApiCall: GET /api/society/balance
export async function getSocietyBalanceAPI(): Promise<{
  currentBalance: number;
  totalPayments: number;
  totalExpenditure: number;
  lastUpdated: string;
}> {
  return fetchWithAuth('/api/society/balance');
}

// ApiCall: PUT /api/society/balance
// APIChange: Added API to update initial society balance
export async function updateSocietyBalanceAPI(initialBalance: number): Promise<{
  currentBalance: number;
  totalIncome: number;
  totalExpenditure: number;
  lastUpdated: string;
}> {
  return fetchWithAuth('/api/society/balance', {
    method: 'PUT',
    body: JSON.stringify({ initialBalance }),
  });
}

// ==================== MEMBER STATEMENT APIs ====================

// ApiCall: GET /api/statements/:memberId
export async function getMemberStatementAPI(memberId: string): Promise<{
  member: {
    id: string;
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
}> {
  return fetchWithAuth(`/api/statements/${memberId}`);
}
export interface Member {
  id: string;
  name: string;
  flatNumber: string;
  email: string;
  phone: string;
  monthlyAmount: number;
  houseType?: string;
  electricityArrear?: number; // One-time electricity dues
  onboardingDate: string; // Format: YYYY-MM-DD - Member joining date
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  month?: string; // Format: YYYY-MM (optional for electricity payments)
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  paymentType: 'maintenance' | 'electricity'; // Type of payment
}

export interface PendingDue {
  memberId: string;
  memberName: string;
  month: string;
  amount: number;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'readonly';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}
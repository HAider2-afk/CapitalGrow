export type RiskLevel = 'low' | 'moderate' | 'mod-high' | 'high';

export interface Plan {
  id: string;
  name: string;
  minInvestment: number;
  riskLevel: RiskLevel;
  riskLabel: string;
  projectedReturn: string;
  returnSubtext: string;
  features: string[];
  recommended?: boolean;
  description?: string;
  lockupPeriod?: string;
}

export interface UserHolding {
  id: string;
  planId: string;
  planName: string;
  investedAmount: number;
  currentValue: number;
  returnPercentage: number;
  startDate: string;
  status: 'Active' | 'Matured' | 'Paused';
  riskLevel: RiskLevel;
}

export type TransactionType = 'Deposit' | 'Withdrawal' | 'Interest' | 'Referral';
export type TransactionStatus = 'Approved' | 'Pending' | 'Rejected';

export interface AdminPaymentAccount {
  id: string;
  type: 'bank' | 'wallet' | 'raast' | 'crypto';
  name: string;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  branchOrTill?: string;
  instructions?: string;
  isActive: boolean;
  currency: string;
  isPrimary?: boolean;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  method: string;
  status: TransactionStatus;
  referenceId: string;
  userName?: string;
  userEmail?: string;
  isNewUser?: boolean;
  userKycStatus?: 'verified' | 'pending' | 'unverified';
  receiptUrl?: string;
  receiptNote?: string;
  depositAccount?: string;
  confirmedAt?: string;
  confirmedBy?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  type: 'approval' | 'rejection' | 'security' | 'config' | 'account_update';
  details?: string;
  targetId?: string;
  adminEmail?: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  balance: number;
  totalInvested: number;
  currency: string;
  kycStatus: 'unverified' | 'pending' | 'verified';
  kycStep: number;
  kycData?: {
    dob?: string;
    nationality?: string;
    idType?: string;
    idNumber?: string;
    address?: string;
    documentUrl?: string;
    selfieUrl?: string;
  };
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
  referralCode: string;
  referralCount: number;
  referralRewards: number;
  role: 'user' | 'admin';
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export type TicketCategory =
  | 'deposit'
  | 'withdrawal'
  | 'kyc'
  | 'plan_inquiry'
  | 'security'
  | 'general';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  transactionRef?: string;
  messages: SupportTicketMessage[];
}

export type DashboardView =
  | 'overview'
  | 'portfolio'
  | 'investments'
  | 'transactions'
  | 'deposit'
  | 'withdraw'
  | 'referrals'
  | 'notifications'
  | 'profile'
  | 'security'
  | 'kyc'
  | 'admin'
  | 'support';

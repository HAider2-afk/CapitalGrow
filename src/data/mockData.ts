import {
  Plan,
  UserHolding,
  Transaction,
  NotificationItem,
  AuditLog,
  UserProfile,
  AdminPaymentAccount,
  SupportTicket
} from '../types';

export const INITIAL_ADMIN_PAYMENT_ACCOUNTS: AdminPaymentAccount[] = [
  {
    id: 'acc-1',
    type: 'bank',
    name: 'Meezan Bank Ltd (Islamic Banking)',
    accountTitle: 'CapitalGrow Treasury Operations Ltd',
    accountNumber: '0281-0104921092',
    iban: 'PK42MEZN0002810104921092',
    branchOrTill: '0281 (Blue Area Branch, Islamabad)',
    instructions: 'Please include your Account ID or CNIC in transfer remarks. Upload receipt after transfer.',
    isActive: true,
    currency: 'PKR',
    isPrimary: true,
    updatedAt: '12 Sep 2026'
  },
  {
    id: 'acc-2',
    type: 'bank',
    name: 'Habib Bank Limited (HBL)',
    accountTitle: 'CapitalGrow Corporate Liquidity Escrow',
    accountNumber: '1092-7901248901',
    iban: 'PK88HABB0010927901248901',
    branchOrTill: '1092 (Main Boulevard, Gulberg, Lahore)',
    instructions: 'Instant interbank transfer via 1Link. Retain transaction receipt for verification.',
    isActive: true,
    currency: 'PKR',
    isPrimary: false,
    updatedAt: '10 Sep 2026'
  },
  {
    id: 'acc-3',
    type: 'wallet',
    name: 'JazzCash Merchant Till',
    accountTitle: 'CapitalGrow Digital Collections',
    accountNumber: '0300-9876543',
    branchOrTill: 'Till # 00918231',
    instructions: 'Dial *786*10# or open JazzCash App > Loyalty & Merchant Payment > Till 00918231.',
    isActive: true,
    currency: 'PKR',
    isPrimary: false,
    updatedAt: '14 Sep 2026'
  },
  {
    id: 'acc-4',
    type: 'wallet',
    name: 'Easypaisa Corporate Account',
    accountTitle: 'CapitalGrow Asset Management',
    accountNumber: '0345-8899112',
    branchOrTill: 'Till # 00481920',
    instructions: 'Pay via Easypaisa App > Payment to Merchant > Till 00481920 or direct mobile transfer.',
    isActive: true,
    currency: 'PKR',
    isPrimary: false,
    updatedAt: '08 Sep 2026'
  },
  {
    id: 'acc-5',
    type: 'raast',
    name: 'Raast Instant P2P / P2M (State Bank of Pakistan)',
    accountTitle: 'CapitalGrow Operations',
    accountNumber: '03009876543',
    instructions: 'Send via Raast ID on any banking app. Zero fees, instant settlement.',
    isActive: false,
    currency: 'PKR',
    isPrimary: false,
    updatedAt: '01 Sep 2026'
  }
];

export const INVESTMENT_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    minInvestment: 350,
    riskLevel: 'low',
    riskLabel: 'Low Risk',
    projectedReturn: '6–12%',
    returnSubtext: 'Historical average over cycle · Capital preservation focus',
    features: [
      'Low minimum entry starting at Rs. 350',
      'Daily automated yield accrual',
      'Zero lockup — flexible withdrawal anytime',
      'Standard portfolio tracking & reporting',
      'Community & email support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    minInvestment: 750,
    riskLevel: 'moderate',
    riskLabel: 'Moderate Risk',
    projectedReturn: '12–18%',
    returnSubtext: 'Balanced asset allocation · Growth-oriented',
    recommended: true,
    features: [
      'Diversified equity & high-yield paper',
      'Automated reinvestment (compounding)',
      'Quarterly rebalancing algorithm',
      'Advanced analytics & return forecasting',
      'Priority ticket & chat assistance'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    minInvestment: 1050,
    riskLevel: 'mod-high',
    riskLabel: 'Moderate–High Risk',
    projectedReturn: '18–26%',
    returnSubtext: 'Dynamic hedging & mezzanine debt exposure',
    features: [
      'Exposure to private equity syndications',
      'Bi-weekly dividend distributions',
      'Hedging against currency volatility',
      'Dedicated wealth relationship manager',
      'Detailed tax-efficient statement exports'
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    minInvestment: 1500,
    riskLevel: 'high',
    riskLabel: 'High Risk',
    projectedReturn: '26–38%',
    returnSubtext: 'Aggressive alpha & venture liquidity pools',
    features: [
      'Exclusive high-yield alternative assets',
      'Institutional execution tier',
      'Early access to private debt rounds',
      '24/7 dedicated financial concierge',
      'Custom bespoke allocation limits'
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  uid: 'usr-cg-10042',
  fullName: 'Aisha Khan',
  email: 'aisha.khan@example.com',
  phone: '+92 300 1234567',
  country: 'Pakistan',
  balance: 12400,
  totalInvested: 150000,
  currency: 'Rs.',
  kycStatus: 'verified',
  kycStep: 4,
  kycData: {
    dob: '1994-06-14',
    nationality: 'Pakistani',
    idType: 'CNIC / National Identity Card',
    idNumber: '42101-5829103-2',
    address: 'Suite 4B, Gulberg Greens, Islamabad'
  },
  twoFactorEnabled: true,
  loginAlertsEnabled: true,
  referralCode: 'CG-7XQ2',
  referralCount: 14,
  referralRewards: 4200,
  role: 'user'
};

export const INITIAL_HOLDINGS: UserHolding[] = [
  {
    id: 'hold-1',
    planId: 'starter',
    planName: 'Starter',
    investedAmount: 20000,
    currentValue: 21340,
    returnPercentage: 6.7,
    startDate: '12 Mar 2026',
    status: 'Active',
    riskLevel: 'low'
  },
  {
    id: 'hold-2',
    planId: 'growth',
    planName: 'Growth',
    investedAmount: 80000,
    currentValue: 89600,
    returnPercentage: 12.0,
    startDate: '02 May 2026',
    status: 'Active',
    riskLevel: 'moderate'
  },
  {
    id: 'hold-3',
    planId: 'premium',
    planName: 'Premium',
    investedAmount: 50000,
    currentValue: 73380,
    returnPercentage: 46.8,
    startDate: '19 Jul 2026',
    status: 'Active',
    riskLevel: 'mod-high'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-9021',
    date: '28 Aug 2026',
    type: 'Deposit',
    amount: 20000,
    method: 'Bank Transfer (Meezan)',
    status: 'Approved',
    referenceId: 'MEEZ-4920491',
    userName: 'Aisha Khan'
  },
  {
    id: 'TXN-9018',
    date: '26 Aug 2026',
    type: 'Withdrawal',
    amount: 5000,
    method: 'Easypaisa',
    status: 'Pending',
    referenceId: 'EP-9024810',
    userName: 'Aisha Khan'
  },
  {
    id: 'TXN-8842',
    date: '14 Aug 2026',
    type: 'Deposit',
    amount: 50000,
    method: 'JazzCash',
    status: 'Approved',
    referenceId: 'JC-8841029',
    userName: 'Aisha Khan'
  },
  {
    id: 'TXN-8720',
    date: '02 Aug 2026',
    type: 'Withdrawal',
    amount: 2500,
    method: 'Bank Transfer (HBL)',
    status: 'Rejected',
    referenceId: 'HBL-0029411',
    userName: 'Aisha Khan'
  },
  {
    id: 'TXN-8511',
    date: '24 Jul 2026',
    type: 'Interest',
    amount: 1120,
    method: 'Growth Plan Accrual',
    status: 'Approved',
    referenceId: 'INT-409124',
    userName: 'Aisha Khan'
  },
  {
    id: 'TXN-8390',
    date: '10 Jul 2026',
    type: 'Referral',
    amount: 600,
    method: 'Referral Bonus (Direct)',
    status: 'Approved',
    referenceId: 'REF-001294',
    userName: 'Aisha Khan'
  }
];

export const INITIAL_PENDING_ADMIN_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-P108',
    date: 'Today, 01:25 PM',
    type: 'Deposit',
    amount: 50000,
    method: 'Meezan Bank Ltd',
    status: 'Pending',
    referenceId: 'MEEZ-99410291',
    userName: 'Taimoor Shah',
    userEmail: 'taimoor.shah@gmail.com',
    isNewUser: true,
    userKycStatus: 'pending',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    receiptNote: 'First-time deposit of Rs. 50,000 from Meezan personal mobile banking to CapitalGrow Treasury.',
    depositAccount: 'Meezan Bank Ltd (Islamic Banking)'
  },
  {
    id: 'TXN-P109',
    date: 'Today, 12:40 PM',
    type: 'Deposit',
    amount: 25000,
    method: 'JazzCash Merchant',
    status: 'Pending',
    referenceId: 'JC-77391024',
    userName: 'Sara Ahmed',
    userEmail: 'sara.ahmed.fin@outlook.com',
    isNewUser: true,
    userKycStatus: 'verified',
    receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    receiptNote: 'Paid to Merchant Till #00918231 via JazzCash App. Reference provided in SMS.',
    depositAccount: 'JazzCash Merchant Till'
  },
  {
    id: 'TXN-P105',
    date: 'Today, 10:45 AM',
    type: 'Deposit',
    amount: 30000,
    method: 'Easypaisa Corporate',
    status: 'Pending',
    referenceId: 'EP-449102',
    userName: 'Fatima Noor',
    userEmail: 'fatima.noor@yahoo.com',
    isNewUser: false,
    userKycStatus: 'verified',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    receiptNote: 'Monthly growth plan top-up transferred to Easypaisa till.',
    depositAccount: 'Easypaisa Corporate Account'
  },
  {
    id: 'TXN-P107',
    date: 'Yesterday, 05:40 PM',
    type: 'Deposit',
    amount: 75000,
    method: 'Habib Bank Limited (HBL)',
    status: 'Pending',
    referenceId: 'HBL-7820194',
    userName: 'Zainab Qureshi',
    userEmail: 'zainab.q@gmail.com',
    isNewUser: false,
    userKycStatus: 'verified',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    receiptNote: 'Interbank funds transfer to HBL Escrow. Transaction slip attached.',
    depositAccount: 'Habib Bank Limited (HBL)'
  },
  {
    id: 'TXN-P104',
    date: 'Today, 11:20 AM',
    type: 'Withdrawal',
    amount: 15000,
    method: 'Bank Transfer (Meezan)',
    status: 'Pending',
    referenceId: 'WT-104921',
    userName: 'Hamza Tariq',
    userEmail: 'hamza.tariq@gmail.com',
    isNewUser: false,
    userKycStatus: 'verified'
  },
  {
    id: 'TXN-P106',
    date: 'Today, 09:15 AM',
    type: 'Withdrawal',
    amount: 8200,
    method: 'JazzCash',
    status: 'Pending',
    referenceId: 'JC-839103',
    userName: 'Usman Ali',
    userEmail: 'usman.ali@hotmail.com',
    isNewUser: false,
    userKycStatus: 'verified'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '10:14 AM',
    admin: 'admin@capitalgrow',
    action: 'Approved deposit #DEP-88213 (Rs. 20,000 for Aisha Khan)',
    type: 'approval'
  },
  {
    id: 'aud-2',
    timestamp: '09:52 AM',
    admin: 'compliance@capitalgrow',
    action: 'Verified KYC Level 2 identity documentation for user #USR-40012',
    type: 'security'
  },
  {
    id: 'aud-3',
    timestamp: '09:30 AM',
    admin: 'admin@capitalgrow',
    action: 'Updated Growth plan fee schedule and quarterly rate disclosures',
    type: 'config'
  },
  {
    id: 'aud-4',
    timestamp: 'Yesterday, 04:10 PM',
    admin: 'risk@capitalgrow',
    action: 'Rejected withdrawal #TXN-8720 due to unverified recipient IBAN mismatch',
    type: 'rejection'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Deposit Approved — Rs. 20,000',
    description: 'Your Meezan Bank transfer has cleared and added to your portfolio balance.',
    timestamp: 'Today, 9:41 AM',
    type: 'success',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Withdrawal Pending Review — Rs. 5,000',
    description: 'Your request via Easypaisa is currently queued with our compliance desk.',
    timestamp: 'Yesterday, 4:12 PM',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-3',
    title: 'KYC Verification Approved',
    description: 'Level 2 Identity checks passed successfully. All deposit & withdrawal limits are unlocked.',
    timestamp: '3 days ago',
    type: 'success',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Security Alert: New Device Sign-in',
    description: 'Authorized login detected from Chrome on macOS (IP: 182.185.124.9).',
    timestamp: '5 days ago',
    type: 'info',
    read: true
  },
  {
    id: 'notif-5',
    title: 'Growth Plan Matured Interest Posted',
    description: 'Rs. 1,120 in monthly performance yield was credited to your holdings.',
    timestamp: '6 days ago',
    type: 'success',
    read: true
  },
  {
    id: 'notif-6',
    title: 'Scheduled System Maintenance',
    description: 'Planned database optimization on Sept 20 between 02:00 AM - 04:00 AM PKT.',
    timestamp: '1 week ago',
    type: 'info',
    read: true
  }
];

export const FAQS = [
  {
    question: 'What is CapitalGrow?',
    answer: 'CapitalGrow is an institutional-grade investment management web application designed for transparent asset growth. It gives individual and corporate investors clear oversight of tiered investment portfolios, instant yield calculations, and audited cash movements.'
  },
  {
    question: 'How does investing work on the platform?',
    answer: 'Investors select a tailored risk plan (Starter, Growth, Premium, or Elite), complete identity verification (KYC), and fund their account via supported banking or wallet channels. Portfolios rebalance systematically, and performance updates reflect directly in real-time.'
  },
  {
    question: 'What are the risks involved in investing?',
    answer: 'All investments carry risk, including market fluctuations and the potential loss of principal capital. Each plan features an upfront risk grading (Low, Moderate, Mod-High, or High) allowing you to allocate strictly according to your financial profile.'
  },
  {
    question: 'How do deposits and withdrawals work?',
    answer: 'Deposits are credited upon banking confirmation (typically within 15–30 minutes). Withdrawals can be requested to any verified local bank account or mobile wallet, with processing completed within 1–3 business days subject to our standard 1% transfer handling fee.'
  },
  {
    question: 'Are returns guaranteed?',
    answer: 'No. CapitalGrow does not promise or guarantee fixed returns. Any figures cited (such as the 6–12% historical baseline) represent illustrative past cyclical performances and do not constitute a warranty or legally binding future projection.'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-4081',
    userId: 'usr-1',
    userName: 'Aisha Khan',
    userEmail: 'aisha.khan@example.com',
    subject: 'Verification status of Meezan Bank deposit',
    category: 'deposit',
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Today, 11:20 AM',
    updatedAt: 'Today, 11:45 AM',
    transactionRef: 'MEEZ-4920491',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Aisha Khan',
        text: 'Hi, I transferred Rs. 20,000 to the Meezan Bank escrow account about 45 minutes ago and uploaded the transfer receipt. Could you please confirm when it will reflect in my portfolio?',
        timestamp: '11:20 AM'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Hamza Tariq (Treasury Support)',
        text: 'Hello Aisha, thank you for reaching out. We have located your transfer receipt for transaction Ref MEEZ-4920491. Our treasury reconciliation desk is verifying the settlement with Meezan Bank. It will be credited within 10–15 minutes.',
        timestamp: '11:45 AM'
      }
    ]
  },
  {
    id: 'TCK-3920',
    userId: 'usr-1',
    userName: 'Aisha Khan',
    userEmail: 'aisha.khan@example.com',
    subject: 'Question on Growth Plan maturity date & reinvestment',
    category: 'plan_inquiry',
    priority: 'medium',
    status: 'resolved',
    createdAt: 'Yesterday, 03:15 PM',
    updatedAt: 'Yesterday, 04:10 PM',
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        senderName: 'Aisha Khan',
        text: 'Can I choose to auto-reinvest my monthly interest yield back into the Growth plan rather than holding it in liquid balance?',
        timestamp: 'Yesterday, 03:15 PM'
      },
      {
        id: 'msg-4',
        sender: 'agent',
        senderName: 'Fatima Zafar (Advisory Desk)',
        text: 'Yes absolutely! Once your monthly yield is posted, you can allocate directly into the Growth plan from your Investments view without incurring any additional fees.',
        timestamp: 'Yesterday, 04:10 PM'
      }
    ]
  },
  {
    id: 'TCK-4102',
    userId: 'usr-2',
    userName: 'Taimoor Shah',
    userEmail: 'taimoor.shah@gmail.com',
    subject: 'First-time deposit verification and bank account details confirmation',
    category: 'deposit',
    priority: 'urgent',
    status: 'open',
    createdAt: 'Today, 01:30 PM',
    updatedAt: 'Today, 01:30 PM',
    transactionRef: 'MEEZ-99410291',
    messages: [
      {
        id: 'msg-5',
        sender: 'user',
        senderName: 'Taimoor Shah',
        text: 'Hello, I just registered as a new user and made my first deposit of Rs. 50,000 to your Meezan Bank account. Please verify the slip.',
        timestamp: '01:30 PM'
      }
    ]
  }
];

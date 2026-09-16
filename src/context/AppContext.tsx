import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  DashboardView,
  Plan,
  UserHolding,
  Transaction,
  NotificationItem,
  AuditLog,
  AdminPaymentAccount,
  SupportTicket,
  SupportTicketMessage,
  TicketCategory,
  TicketPriority,
  TicketStatus
} from '../types';
import {
  INVESTMENT_PLANS,
  INITIAL_HOLDINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_PENDING_ADMIN_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_PAYMENT_ACCOUNTS,
  INITIAL_SUPPORT_TICKETS
} from '../data/mockData';
import { useAuth } from './AuthContext';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from '../lib/firebase';
import config from '../../firebase-applet-config.json';

export interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingApprovals: number;
  newUserPendingCount: number;
}

interface AppContextType {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  currency: string;
  setCurrency: (c: string) => void;
  formatCurrency: (amount: number) => string;
  plans: Plan[];
  holdings: UserHolding[];
  transactions: Transaction[];
  pendingAdminTransactions: Transaction[];
  paymentAccounts: AdminPaymentAccount[];
  addPaymentAccount: (account: Omit<AdminPaymentAccount, 'id' | 'updatedAt'>) => void;
  updatePaymentAccount: (id: string, updates: Partial<AdminPaymentAccount>) => void;
  deletePaymentAccount: (id: string) => void;
  togglePaymentAccountStatus: (id: string) => void;
  setPrimaryPaymentAccount: (id: string) => void;
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  totalPortfolioValue: number;
  totalInvested: number;
  totalProfit: number;
  portfolioGrowthPercentage: number;
  adminStats: AdminStats;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isFirebaseLive: boolean;
  firestoreDatabaseId: string;
  firestoreSyncStatus: 'synced' | 'connecting' | 'offline';
  addDeposit: (amount: number, method: string, referenceId: string, receiptNote?: string, receiptUrl?: string, depositAccount?: string) => void;
  requestWithdrawal: (amount: number, method: string, accountTitle: string, accountNumber: string) => boolean;
  investInPlan: (planId: string, amount: number) => boolean;
  approveTransaction: (txnId: string) => void;
  rejectTransaction: (txnId: string, reason?: string) => void;
  confirmAllPendingDeposits: () => void;
  submitKycStep: (step: number, data: any) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  supportTickets: SupportTicket[];
  openTicketCount: number;
  createSupportTicket: (
    category: TicketCategory,
    subject: string,
    initialMessage: string,
    priority?: TicketPriority,
    transactionRef?: string
  ) => string;
  replyToSupportTicket: (
    ticketId: string,
    text: string,
    senderOverride?: 'user' | 'agent',
    senderNameOverride?: string
  ) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [currency, setCurrency] = useState<string>('Rs.');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState<'synced' | 'connecting' | 'offline'>('connecting');

  const seededRef = useRef(false);

  // Holdings state
  const [holdings, setHoldings] = useState<UserHolding[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_holdings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_HOLDINGS;
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_txns');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  // Admin Pending queue
  const [pendingAdminTransactions, setPendingAdminTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_admin_pending');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PENDING_ADMIN_TRANSACTIONS;
  });

  // Admin Payment Accounts (Bank accounts, wallets, Raast shared with users)
  const [paymentAccounts, setPaymentAccounts] = useState<AdminPaymentAccount[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_payment_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ADMIN_PAYMENT_ACCOUNTS;
  });

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_audit');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_notifs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  // Support tickets state
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('capitalgrow_tickets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUPPORT_TICKETS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('capitalgrow_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('capitalgrow_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('capitalgrow_admin_pending', JSON.stringify(pendingAdminTransactions));
  }, [pendingAdminTransactions]);

  useEffect(() => {
    localStorage.setItem('capitalgrow_payment_accounts', JSON.stringify(paymentAccounts));
  }, [paymentAccounts]);

  useEffect(() => {
    localStorage.setItem('capitalgrow_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('capitalgrow_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('capitalgrow_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Firestore Real-time Listeners and Bootstrapping
  useEffect(() => {
    if (!db) return;

    let unsubPayments: () => void = () => {};
    let unsubTxns: () => void = () => {};
    let unsubTickets: () => void = () => {};

    try {
      // 1. Payment Accounts listener
      const payCol = collection(db, 'paymentAccounts');
      unsubPayments = onSnapshot(
        payCol,
        (snap) => {
          setFirestoreSyncStatus('synced');
          if (!snap.empty) {
            const list: AdminPaymentAccount[] = [];
            snap.forEach((d) => list.push(d.data() as AdminPaymentAccount));
            setPaymentAccounts(list);
          } else if (!seededRef.current) {
            // Seed initial payment accounts to Firestore
            INITIAL_ADMIN_PAYMENT_ACCOUNTS.forEach((acc) => {
              setDoc(doc(db, 'paymentAccounts', acc.id), acc).catch(() => {});
            });
          }
        },
        (err) => {
          console.warn('Firestore paymentAccounts listener fallback:', err);
          setFirestoreSyncStatus('offline');
        }
      );

      // 2. Transactions listener
      const txnCol = collection(db, 'transactions');
      unsubTxns = onSnapshot(
        txnCol,
        (snap) => {
          setFirestoreSyncStatus('synced');
          if (!snap.empty) {
            const list: Transaction[] = [];
            snap.forEach((d) => list.push(d.data() as Transaction));
            setTransactions(list);
            setPendingAdminTransactions(list.filter((t) => t.status === 'Pending'));
          } else if (!seededRef.current) {
            // Seed initial transactions
            const combined = [...INITIAL_PENDING_ADMIN_TRANSACTIONS, ...INITIAL_TRANSACTIONS];
            combined.forEach((t) => {
              setDoc(doc(db, 'transactions', t.id), t).catch(() => {});
            });
          }
        },
        (err) => {
          console.warn('Firestore transactions listener fallback:', err);
          setFirestoreSyncStatus('offline');
        }
      );

      // 3. Support Tickets listener
      const ticketCol = collection(db, 'supportTickets');
      unsubTickets = onSnapshot(
        ticketCol,
        (snap) => {
          setFirestoreSyncStatus('synced');
          if (!snap.empty) {
            const list: SupportTicket[] = [];
            snap.forEach((d) => list.push(d.data() as SupportTicket));
            setSupportTickets(list);
          } else if (!seededRef.current) {
            // Seed initial support tickets
            INITIAL_SUPPORT_TICKETS.forEach((tick) => {
              setDoc(doc(db, 'supportTickets', tick.id), tick).catch(() => {});
            });
          }
          seededRef.current = true;
        },
        (err) => {
          console.warn('Firestore supportTickets listener fallback:', err);
          setFirestoreSyncStatus('offline');
        }
      );
    } catch (e) {
      console.warn('Firebase sync initialization error:', e);
      setFirestoreSyncStatus('offline');
    }

    return () => {
      unsubPayments();
      unsubTxns();
      unsubTickets();
    };
  }, []);

  // Payment Account Management with Firestore persistence
  const addPaymentAccount = (accountData: Omit<AdminPaymentAccount, 'id' | 'updatedAt'>) => {
    const newAccount: AdminPaymentAccount = {
      ...accountData,
      id: 'acc-' + Date.now(),
      updatedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPaymentAccounts((prev) => [newAccount, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'paymentAccounts', newAccount.id), newAccount).catch((err) =>
        console.warn('Firestore addPaymentAccount error:', err)
      );
    } catch (e) {
      console.warn('Firestore save error:', e);
    }

    const log: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      admin: user?.email || 'admin@capitalgrow',
      action: `Created new payment account: ${newAccount.name} (${newAccount.accountNumber})`,
      type: 'account_update',
      targetId: newAccount.id
    };
    setAuditLogs((prev) => [log, ...prev]);
    try {
      setDoc(doc(db, 'auditLogs', log.id), log).catch(() => {});
    } catch {}

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Payment Channel Published',
      description: `${newAccount.name} (${newAccount.type.toUpperCase()}) is now active for user deposits.`,
      timestamp: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updatePaymentAccount = (id: string, updates: Partial<AdminPaymentAccount>) => {
    const time = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPaymentAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates, updatedAt: time } : acc))
    );

    // Update in Firestore
    try {
      updateDoc(doc(db, 'paymentAccounts', id), { ...updates, updatedAt: time }).catch((err) =>
        console.warn('Firestore updatePaymentAccount error:', err)
      );
    } catch (e) {
      console.warn('Firestore update error:', e);
    }

    const log: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      admin: user?.email || 'admin@capitalgrow',
      action: `Updated payment account ID: ${id}`,
      type: 'account_update',
      targetId: id
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const deletePaymentAccount = (id: string) => {
    const toDelete = paymentAccounts.find((a) => a.id === id);
    setPaymentAccounts((prev) => prev.filter((acc) => acc.id !== id));

    // Delete in Firestore
    try {
      deleteDoc(doc(db, 'paymentAccounts', id)).catch((err) =>
        console.warn('Firestore deletePaymentAccount error:', err)
      );
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }

    const log: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      admin: user?.email || 'admin@capitalgrow',
      action: `Deleted payment account: ${toDelete?.name || id}`,
      type: 'account_update',
      targetId: id
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const togglePaymentAccountStatus = (id: string) => {
    setPaymentAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const newStatus = !acc.isActive;
          try {
            updateDoc(doc(db, 'paymentAccounts', id), { isActive: newStatus }).catch(() => {});
          } catch {}

          const log: AuditLog = {
            id: 'aud-' + Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            admin: user?.email || 'admin@capitalgrow',
            action: `${newStatus ? 'Activated' : 'Deactivated'} payment account: ${acc.name}`,
            type: 'account_update',
            targetId: id
          };
          setAuditLogs((l) => [log, ...l]);
          return { ...acc, isActive: newStatus };
        }
        return acc;
      })
    );
  };

  const setPrimaryPaymentAccount = (id: string) => {
    setPaymentAccounts((prev) =>
      prev.map((acc) => {
        const isPrim = acc.id === id;
        try {
          updateDoc(doc(db, 'paymentAccounts', acc.id), { isPrimary: isPrim }).catch(() => {});
        } catch {}
        return {
          ...acc,
          isPrimary: isPrim
        };
      })
    );
  };

  // Derived portfolio totals
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPortfolioValue = (user?.balance || 0) + totalHoldingsValue;
  const totalProfit = totalHoldingsValue - totalInvested;
  const portfolioGrowthPercentage = totalInvested > 0 ? Number(((totalProfit / totalInvested) * 100).toFixed(1)) : 0;

  // Admin stats
  const adminStats: AdminStats = {
    totalUsers: 14820,
    totalDeposits: 48600000 + (transactions.filter((t) => t.type === 'Deposit' && t.status === 'Approved').reduce((s, t) => s + t.amount, 0) - 70000),
    totalWithdrawals: 21400000,
    pendingApprovals: pendingAdminTransactions.length,
    newUserPendingCount: pendingAdminTransactions.filter((t) => t.isNewUser && t.type === 'Deposit').length
  };

  const formatCurrency = (amount: number): string => {
    const formatted = Math.round(amount).toLocaleString('en-US');
    return `${currency} ${formatted}`;
  };

  const addDeposit = (
    amount: number,
    method: string,
    referenceId: string,
    receiptNote?: string,
    receiptUrl?: string,
    depositAccount?: string
  ) => {
    const isNew = !user || (user.totalInvested === 0 && (user.balance || 0) < 10000);
    const newTxn: Transaction = {
      id: 'DEP-' + Math.floor(1000 + Math.random() * 9000),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Deposit',
      amount,
      method,
      status: 'Pending',
      referenceId: referenceId || 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      userName: user?.fullName || 'Investor',
      userEmail: user?.email || 'investor@capitalgrow.com',
      isNewUser: isNew,
      userKycStatus: user?.kycStatus || 'pending',
      receiptNote: receiptNote || 'Deposit slip submitted for verification',
      receiptUrl: receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      depositAccount: depositAccount || method
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setPendingAdminTransactions((prev) => [newTxn, ...prev]);

    // Persist to Firestore
    try {
      setDoc(doc(db, 'transactions', newTxn.id), newTxn).catch((err) =>
        console.warn('Firestore addDeposit error:', err)
      );
    } catch (e) {
      console.warn('Firestore transaction save error:', e);
    }

    // Add notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `Deposit Submitted — ${formatCurrency(amount)}`,
      description: `Your ${method} deposit is queued. Admin will verify bank receipt and confirm payment shortly.`,
      timestamp: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const requestWithdrawal = (amount: number, method: string, accountTitle: string, accountNumber: string): boolean => {
    if (!user || user.balance < amount) return false;

    // Deduct balance
    const newBalance = user.balance - amount;
    updateUser({ balance: newBalance });

    const newTxn: Transaction = {
      id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Withdrawal',
      amount,
      method: `${method} (${accountNumber.slice(-4)})`,
      status: 'Pending',
      referenceId: 'WD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      userName: user.fullName
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setPendingAdminTransactions((prev) => [newTxn, ...prev]);

    // Persist to Firestore
    try {
      setDoc(doc(db, 'transactions', newTxn.id), newTxn).catch((err) =>
        console.warn('Firestore requestWithdrawal error:', err)
      );
    } catch (e) {
      console.warn('Firestore save error:', e);
    }

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `Withdrawal Queued — ${formatCurrency(amount)}`,
      description: `Funds transfer to ${accountTitle} (${method}) is pending compliance authorization.`,
      timestamp: 'Just now',
      type: 'warning',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);

    return true;
  };

  const investInPlan = (planId: string, amount: number): boolean => {
    if (!user || user.balance < amount) return false;

    const plan = INVESTMENT_PLANS.find((p) => p.id === planId);
    if (!plan) return false;

    // Deduct from balance
    updateUser({
      balance: user.balance - amount,
      totalInvested: (user.totalInvested || 0) + amount
    });

    const newHoldingId = 'hold-' + Date.now();
    let createdHolding: UserHolding;

    setHoldings((prev) => {
      const existing = prev.find((h) => h.planId === planId);
      if (existing) {
        createdHolding = {
          ...existing,
          investedAmount: existing.investedAmount + amount,
          currentValue: existing.currentValue + amount,
          startDate: 'Updated Today'
        };
        try {
          setDoc(doc(db, 'holdings', existing.id), createdHolding, { merge: true }).catch(() => {});
        } catch {}
        return prev.map((h) => (h.planId === planId ? createdHolding : h));
      } else {
        createdHolding = {
          id: newHoldingId,
          planId: plan.id,
          planName: plan.name,
          investedAmount: amount,
          currentValue: amount,
          returnPercentage: 0,
          startDate: 'Today',
          status: 'Active',
          riskLevel: plan.riskLevel
        };
        try {
          setDoc(doc(db, 'holdings', newHoldingId), createdHolding).catch(() => {});
        } catch {}
        return [...prev, createdHolding];
      }
    });

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `Invested in ${plan.name} Plan`,
      description: `Successfully allocated ${formatCurrency(amount)} into ${plan.riskLabel} strategy.`,
      timestamp: 'Just now',
      type: 'success',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);

    return true;
  };

  const approveTransaction = (txnId: string) => {
    const approvedTxn =
      pendingAdminTransactions.find((t) => t.id === txnId) ||
      transactions.find((t) => t.id === txnId);

    setPendingAdminTransactions((prev) => prev.filter((t) => t.id !== txnId));

    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: 'Approved' } : t))
    );

    // Update in Firestore
    try {
      updateDoc(doc(db, 'transactions', txnId), { status: 'Approved' }).catch((err) =>
        console.warn('Firestore approveTransaction error:', err)
      );
    } catch (e) {
      console.warn('Firestore error:', e);
    }

    if (approvedTxn) {
      if (user && approvedTxn.type === 'Deposit') {
        updateUser({ balance: (user.balance || 0) + approvedTxn.amount });
      }

      const log: AuditLog = {
        id: 'aud-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        admin: user?.email || 'admin@capitalgrow',
        action: `Approved ${approvedTxn.type.toLowerCase()} #${approvedTxn.id} (${formatCurrency(approvedTxn.amount)} for ${approvedTxn.userName || 'User'})`,
        type: 'approval'
      };
      setAuditLogs((prev) => [log, ...prev]);
      try {
        setDoc(doc(db, 'auditLogs', log.id), log).catch(() => {});
      } catch {}

      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `${approvedTxn.type} Approved`,
        description: `Your ${approvedTxn.type.toLowerCase()} #${approvedTxn.id} for ${formatCurrency(approvedTxn.amount)} has been cleared and confirmed.`,
        timestamp: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const rejectTransaction = (txnId: string, reason = 'Verification criteria not satisfied') => {
    const rejectedTxn =
      pendingAdminTransactions.find((t) => t.id === txnId) ||
      transactions.find((t) => t.id === txnId);

    setPendingAdminTransactions((prev) => prev.filter((t) => t.id !== txnId));

    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: 'Rejected' } : t))
    );

    // Update in Firestore
    try {
      updateDoc(doc(db, 'transactions', txnId), { status: 'Rejected', rejectionReason: reason }).catch((err) =>
        console.warn('Firestore rejectTransaction error:', err)
      );
    } catch (e) {
      console.warn('Firestore error:', e);
    }

    if (rejectedTxn) {
      if (user && rejectedTxn.type === 'Withdrawal') {
        updateUser({ balance: (user.balance || 0) + rejectedTxn.amount });
      }

      const log: AuditLog = {
        id: 'aud-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        admin: user?.email || 'risk@capitalgrow',
        action: `Rejected ${rejectedTxn.type.toLowerCase()} #${rejectedTxn.id} (${formatCurrency(rejectedTxn.amount)}). Reason: ${reason}`,
        type: 'rejection'
      };
      setAuditLogs((prev) => [log, ...prev]);
      try {
        setDoc(doc(db, 'auditLogs', log.id), log).catch(() => {});
      } catch {}

      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `${rejectedTxn.type} Rejected`,
        description: `Your ${rejectedTxn.type.toLowerCase()} #${rejectedTxn.id} was declined: ${reason}.`,
        timestamp: 'Just now',
        type: 'danger',
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const confirmAllPendingDeposits = () => {
    const deposits = pendingAdminTransactions.filter((t) => t.type === 'Deposit');
    if (deposits.length === 0) return;

    const totalAmount = deposits.reduce((sum, t) => sum + t.amount, 0);

    setPendingAdminTransactions((prev) => prev.filter((t) => t.type !== 'Deposit'));
    setTransactions((prev) =>
      prev.map((t) => (t.type === 'Deposit' && t.status === 'Pending' ? { ...t, status: 'Approved' } : t))
    );

    // Update in Firestore
    deposits.forEach((d) => {
      try {
        updateDoc(doc(db, 'transactions', d.id), { status: 'Approved' }).catch(() => {});
      } catch {}
    });

    if (user) {
      updateUser({ balance: (user.balance || 0) + totalAmount });
    }

    const log: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      admin: user?.email || 'admin@capitalgrow',
      action: `Batch confirmed ${deposits.length} deposits (${formatCurrency(totalAmount)})`,
      type: 'approval',
      details: `Batch approved IDs: ${deposits.map((d) => d.id).join(', ')}`
    };
    setAuditLogs((prev) => [log, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `${deposits.length} Payments Confirmed`,
      description: `All pending user deposits totaling ${formatCurrency(totalAmount)} were confirmed and credited.`,
      timestamp: 'Just now',
      type: 'success',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const submitKycStep = (step: number, data: any) => {
    if (!user) return;
    const isCompleted = step >= 4;
    updateUser({
      kycStep: Math.min(4, step + 1),
      kycStatus: isCompleted ? 'verified' : 'pending',
      kycData: { ...user.kycData, ...data }
    });

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: isCompleted ? 'KYC Verification Completed' : `KYC Step ${step} Submitted`,
      description: isCompleted
        ? 'Your identity documents have been authenticated. All account privileges are active.'
        : `Stage ${step} recorded successfully. Please complete the remaining steps.`,
      timestamp: 'Just now',
      type: isCompleted ? 'success' : 'info',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Support Ticket Handlers with Firestore persistence
  const createSupportTicket = (
    category: TicketCategory,
    subject: string,
    initialMessage: string,
    priority: TicketPriority = 'medium',
    transactionRef?: string
  ): string => {
    const newId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTicket: SupportTicket = {
      id: newId,
      userId: user?.uid || 'usr-1',
      userName: user?.fullName || 'Investor',
      userEmail: user?.email || 'investor@capitalgrow.com',
      subject,
      category,
      priority,
      status: 'open',
      createdAt: 'Today, ' + timestamp,
      updatedAt: 'Today, ' + timestamp,
      transactionRef,
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: 'user',
          senderName: user?.fullName || 'Investor',
          text: initialMessage,
          timestamp
        }
      ]
    };

    setSupportTickets((prev) => [newTicket, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'supportTickets', newTicket.id), newTicket).catch((err) =>
        console.warn('Firestore createSupportTicket error:', err)
      );
    } catch (e) {
      console.warn('Firestore save error:', e);
    }

    // Automated acknowledgment from Desk
    setTimeout(() => {
      const autoReply: SupportTicketMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'agent',
        senderName: 'CapitalGrow Treasury Desk',
        text: `Ticket #${newId} registered under ${category.toUpperCase()} category. An escalation officer is examining your request. Expected response is under 15 minutes.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSupportTickets((prev) =>
        prev.map((t) => {
          if (t.id === newId) {
            const updated = {
              ...t,
              status: 'in_progress' as TicketStatus,
              updatedAt: 'Today, ' + autoReply.timestamp,
              messages: [...t.messages, autoReply]
            };
            try {
              updateDoc(doc(db, 'supportTickets', newId), {
                status: 'in_progress',
                updatedAt: updated.updatedAt,
                messages: updated.messages
              }).catch(() => {});
            } catch {}
            return updated;
          }
          return t;
        })
      );
    }, 1200);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `Support Ticket #${newId} Opened`,
      description: `Inquiry "${subject}" assigned to Treasury Support Desk.`,
      timestamp: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);

    return newId;
  };

  const replyToSupportTicket = (
    ticketId: string,
    text: string,
    senderOverride?: 'user' | 'agent',
    senderNameOverride?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAgent = senderOverride === 'agent' || (senderOverride === undefined && user?.role === 'admin');
    const senderType: 'user' | 'agent' = isAgent ? 'agent' : 'user';
    const senderName =
      senderNameOverride ||
      (isAgent
        ? user?.fullName
          ? `${user.fullName} (Support Admin)`
          : 'CapitalGrow Senior Desk'
        : user?.fullName || 'Investor');

    const newMsg: SupportTicketMessage = {
      id: 'msg-' + Date.now(),
      sender: senderType,
      senderName,
      text,
      timestamp
    };

    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newStatus = isAgent ? 'in_progress' : t.status === 'resolved' ? 'open' : t.status;
          const updated = {
            ...t,
            status: newStatus as TicketStatus,
            updatedAt: 'Today, ' + timestamp,
            messages: [...t.messages, newMsg]
          };
          try {
            updateDoc(doc(db, 'supportTickets', ticketId), {
              status: newStatus,
              updatedAt: updated.updatedAt,
              messages: updated.messages
            }).catch((err) => console.warn('Firestore reply error:', err));
          } catch (e) {
            console.warn('Firestore error:', e);
          }
          return updated;
        }
        return t;
      })
    );

    if (isAgent) {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `Response on Ticket #${ticketId}`,
        description: `${senderName}: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
        timestamp: 'Just now',
        type: 'info',
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          try {
            updateDoc(doc(db, 'supportTickets', ticketId), { status, updatedAt: 'Today, ' + timestamp }).catch(
              () => {}
            );
          } catch {}
          return { ...t, status, updatedAt: 'Today, ' + timestamp };
        }
        return t;
      })
    );

    if (status === 'resolved') {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `Ticket #${ticketId} Marked Resolved`,
        description: `Your inquiry has been successfully resolved by the support desk.`,
        timestamp: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const openTicketCount = supportTickets.filter((t) => t.status !== 'resolved').length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currency,
        setCurrency,
        formatCurrency,
        plans: INVESTMENT_PLANS,
        holdings,
        transactions,
        pendingAdminTransactions,
        paymentAccounts,
        addPaymentAccount,
        updatePaymentAccount,
        deletePaymentAccount,
        togglePaymentAccountStatus,
        setPrimaryPaymentAccount,
        auditLogs,
        notifications,
        unreadNotificationCount,
        totalPortfolioValue,
        totalInvested,
        totalProfit,
        portfolioGrowthPercentage,
        adminStats,
        isDarkMode,
        setIsDarkMode,
        isFirebaseLive: true,
        firestoreDatabaseId: config.firestoreDatabaseId || '(default)',
        firestoreSyncStatus,
        addDeposit,
        requestWithdrawal,
        investInPlan,
        approveTransaction,
        rejectTransaction,
        confirmAllPendingDeposits,
        submitKycStep,
        markNotificationRead,
        markAllNotificationsRead,
        supportTickets,
        openTicketCount,
        createSupportTicket,
        replyToSupportTicket,
        updateTicketStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

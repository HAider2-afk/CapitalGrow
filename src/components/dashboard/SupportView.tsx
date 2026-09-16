import React, { useState } from 'react';
import {
  Headphones,
  MessageSquare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Filter,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SupportTicket, TicketCategory, TicketPriority } from '../../types';
import { FAQS } from '../../data/mockData';

export const SupportView: React.FC = () => {
  const {
    supportTickets,
    createSupportTicket,
    replyToSupportTicket,
    updateTicketStatus,
    transactions,
    setCurrentView,
    formatCurrency
  } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    supportTickets[0] || null
  );

  // New Ticket Modal State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<TicketCategory>('deposit');
  const [newPriority, setNewPriority] = useState<TicketPriority>('medium');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTxnRef, setSelectedTxnRef] = useState<string>('');

  // Reply text in chat view
  const [replyText, setReplyText] = useState('');

  // FAQ search & expanded state
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [copiedDesk, setCopiedDesk] = useState<string | null>(null);

  // Filter tickets
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredTickets = supportTickets.filter((t) => {
    if (ticketFilter === 'open') return t.status !== 'resolved';
    if (ticketFilter === 'resolved') return t.status === 'resolved';
    return true;
  });

  const activeTicket = supportTickets.find((t) => t.id === selectedTicket?.id) || selectedTicket;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedDesk(label);
    setTimeout(() => setCopiedDesk(null), 2000);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const ticketId = createSupportTicket(
      newCategory,
      newSubject.trim(),
      newMessage.trim(),
      newPriority,
      selectedTxnRef || undefined
    );

    setIsNewTicketOpen(false);
    setNewSubject('');
    setNewMessage('');
    setSelectedTxnRef('');

    // Select the new ticket
    const newlyCreated = supportTickets.find((t) => t.id === ticketId);
    if (newlyCreated) {
      setSelectedTicket(newlyCreated);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    replyToSupportTicket(activeTicket.id, replyText.trim());
    setReplyText('');
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'urgent':
        return 'bg-[#E5484D]/20 text-[#E5484D] border border-[#E5484D]/30';
      case 'high':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30';
      case 'medium':
        return 'bg-[#10B981]/20 text-[#9C92FF] border border-[#10B981]/30';
      default:
        return 'bg-white/10 text-white/70 border border-white/10';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30';
      case 'in_progress':
        return 'bg-[#10B981]/20 text-[#9C92FF] border border-[#10B981]/30';
      default:
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30';
    }
  };

  // Pre-formatted WhatsApp link
  const whatsappNumber = '923001234567';
  const whatsappMessage = encodeURIComponent(
    `Hello CapitalGrow Treasury Support Desk, I am reaching out regarding my investor account (${user?.email || 'investor@capitalgrow.com'}). I would like assistance with my recent transaction.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Banner with Live Desk Status */}
      <div className="p-6 rounded-[18px] bg-gradient-to-r from-[#131926] via-[#1E1C44] to-[#0B0F17] border border-white/10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono text-[#34D399] font-semibold uppercase tracking-wider">
              Treasury Desk Active • 24/7 Operations
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Customer Support & Help Desk
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
            Have questions regarding bank deposits, withdrawals, verification, or strategy plans?
            Our licensed treasury specialists are standing by.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-[10px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#25D366]/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Support</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-4 py-2.5 rounded-[10px] bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#10B981]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/20'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Tickets</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-white/20">
            {supportTickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/20'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base & FAQs</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/20'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Direct Channels & Escrow Desk</span>
        </button>
      </div>

      {/* TAB 1: SUPPORT TICKETS & INTERACTIVE CHAT */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tickets List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#94A3B8]">Filter:</span>
                {(['all', 'open', 'resolved'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTicketFilter(filter)}
                    className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                      ticketFilter === filter
                        ? 'bg-white/15 text-white'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsNewTicketOpen(true)}
                className="text-xs text-[#34D399] hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            <div className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center rounded-[18px] bg-[#131926]/50 border border-white/10 text-[#94A3B8] space-y-3">
                  <Headphones className="w-8 h-8 mx-auto text-[#10B981]" />
                  <p className="text-sm">No support tickets found.</p>
                  <button
                    onClick={() => setIsNewTicketOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-medium"
                  >
                    Create Your First Ticket
                  </button>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isSelected = activeTicket?.id === ticket.id;
                  const lastMsg = ticket.messages[ticket.messages.length - 1];
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 rounded-[16px] border transition-all cursor-pointer text-left space-y-2.5 ${
                        isSelected
                          ? 'bg-[#131926] border-[#10B981] shadow-lg shadow-[#10B981]/10'
                          : 'bg-[#131926]/60 border-white/10 hover:border-white/20 hover:bg-[#131926]/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              #{ticket.id}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-medium ${getStatusBadge(
                                ticket.status
                              )}`}
                            >
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${getPriorityBadge(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">
                            {ticket.subject}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
                          {ticket.updatedAt}
                        </span>
                      </div>

                      {ticket.transactionRef && (
                        <div className="text-[11px] font-mono text-[#34D399] bg-[#10B981]/10 px-2 py-0.5 rounded inline-block">
                          Ref: {ticket.transactionRef}
                        </div>
                      )}

                      <p className="text-xs text-[#94A3B8] line-clamp-2">
                        <strong className="text-white/80">{lastMsg?.senderName}:</strong>{' '}
                        {lastMsg?.text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Ticket Conversation Thread */}
          <div className="lg:col-span-7">
            {activeTicket ? (
              <div className="rounded-[18px] bg-[#131926] border border-white/10 flex flex-col h-[640px] text-white shadow-xl overflow-hidden">
                {/* Chat Top Bar */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0F172A]/60">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#34D399]">
                        #{activeTicket.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${getStatusBadge(
                          activeTicket.status
                        )}`}
                      >
                        {activeTicket.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#94A3B8] capitalize font-medium">
                        • {activeTicket.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                      {activeTicket.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {activeTicket.status !== 'resolved' ? (
                      <button
                        onClick={() => updateTicketStatus(activeTicket.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#34D399] border border-[#10B981]/30 text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTicketStatus(activeTicket.id, 'open')}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Timeline Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0B0F17]/40">
                  {/* System Header Notice */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8] flex items-center justify-between">
                    <span>
                      Inquiry initiated by <strong>{activeTicket.userName}</strong> on{' '}
                      {activeTicket.createdAt}
                    </span>
                    {activeTicket.transactionRef && (
                      <span className="font-mono text-[#34D399]">
                        Transaction: {activeTicket.transactionRef}
                      </span>
                    )}
                  </div>

                  {/* Message Bubbles */}
                  {activeTicket.messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <div className="flex items-center gap-2 px-1 text-[11px] text-[#94A3B8]">
                          <span className="font-semibold text-white/90">{msg.senderName}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-[14px] text-xs sm:text-sm max-w-lg leading-relaxed shadow-md ${
                            isUser
                              ? 'bg-[#10B981] text-white rounded-tr-none'
                              : 'bg-[#131926] border border-white/10 text-white/90 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Quick Canned Inquiries */}
                {activeTicket.status !== 'resolved' && (
                  <div className="px-4 py-2 bg-[#0F172A]/60 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[11px]">
                    <span className="text-[#94A3B8] shrink-0">Quick ask:</span>
                    <button
                      onClick={() =>
                        setReplyText('Could you please provide an updated ETA on this settlement?')
                      }
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 shrink-0 border border-white/5 transition-colors"
                    >
                      Update ETA?
                    </button>
                    <button
                      onClick={() =>
                        setReplyText('I have attached the bank reference number and transaction slip.')
                      }
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 shrink-0 border border-white/5 transition-colors"
                    >
                      Attached slip
                    </button>
                    <button
                      onClick={() => setReplyText('Thank you, this issue has been resolved!')}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 shrink-0 border border-white/5 transition-colors"
                    >
                      All resolved, thanks!
                    </button>
                  </div>
                )}

                {/* Reply Input Form */}
                {activeTicket.status !== 'resolved' ? (
                  <form
                    onSubmit={handleSendReply}
                    className="p-3 bg-[#0F172A] border-t border-white/10 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your message to the Treasury Desk..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-[#10B981]/20"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-[#0F172A] border-t border-white/10 text-center text-xs text-[#94A3B8]">
                    This ticket is marked resolved.{' '}
                    <button
                      onClick={() => updateTicketStatus(activeTicket.id, 'open')}
                      className="text-[#34D399] underline font-medium"
                    >
                      Click here to reopen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[18px] bg-[#131926]/60 border border-white/10 h-full flex flex-col items-center justify-center p-8 text-[#94A3B8] text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-[#10B981]" />
                <h4 className="text-base font-semibold text-white">Select a Ticket</h4>
                <p className="text-xs max-w-sm">
                  Click on any inquiry on the left to view the complete communication log or send a follow-up.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE BASE & FAQS */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* FAQ Search Bar */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search help articles (e.g. deposit time, bank slip, KYC, returns)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131926] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Quick Help Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setCurrentView('deposit')}
              className="p-4 rounded-[16px] bg-[#131926] border border-white/10 hover:border-[#10B981]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#34D399] transition-colors">
                Bank Transfer Guide
              </h4>
              <p className="text-xs text-[#94A3B8]">
                Step-by-step tutorial on sending funds via Meezan, HBL, Raast, or JazzCash and uploading slips.
              </p>
            </div>

            <div
              onClick={() => setCurrentView('kyc')}
              className="p-4 rounded-[16px] bg-[#131926] border border-white/10 hover:border-[#10B981]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#34D399] transition-colors">
                KYC Identity Standards
              </h4>
              <p className="text-xs text-[#94A3B8]">
                Requirements for National Identity Card (CNIC) or Passport verification for tier 2 limits.
              </p>
            </div>

            <div
              onClick={() => setCurrentView('investments')}
              className="p-4 rounded-[16px] bg-[#131926] border border-white/10 hover:border-[#10B981]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#34D399] transition-colors">
                Daily Yield Mechanics
              </h4>
              <p className="text-xs text-[#94A3B8]">
                Learn how yields accrue daily across Starter, Growth, Premium, and Elite asset portfolios.
              </p>
            </div>
          </div>

          {/* Accordion FAQs */}
          <div className="space-y-3">
            {FAQS.filter(
              (f) =>
                f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                f.answer.toLowerCase().includes(faqSearch.toLowerCase())
            ).map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[16px] bg-[#131926] border border-white/10 overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-4.5 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-heading text-sm sm:text-base font-semibold text-white">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#34D399] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DIRECT CHANNELS & ESCROW DESK */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Official WhatsApp */}
          <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white space-y-4 shadow-xl text-left">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">WhatsApp Priority Desk</h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Direct mobile desk for instant payment slip confirmation and new account queries.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 font-mono text-xs text-[#34D399] flex items-center justify-between">
              <span>+92 300 1234567</span>
              <button
                onClick={() => handleCopy('+923001234567', 'wa')}
                className="text-white/60 hover:text-white"
              >
                {copiedDesk === 'wa' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Open WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Dedicated Phone Hotline */}
          <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white space-y-4 shadow-xl text-left">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Institutional Hotline</h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Speak directly with an accredited investment advisory and portfolio manager.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 font-mono text-xs text-white flex items-center justify-between">
              <span>+92 51 8899001 (Ext. 4)</span>
              <button
                onClick={() => handleCopy('+92518899001', 'phone')}
                className="text-white/60 hover:text-white"
              >
                {copiedDesk === 'phone' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              <strong>Hours:</strong> Mon – Sat: 09:00 AM – 08:00 PM PKT
            </div>
          </div>

          {/* Card 3: Official Compliance Email */}
          <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white space-y-4 shadow-xl text-left">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Treasury & Compliance</h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                For formal corporate audits, bank clearance statements, and wire notices.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 font-mono text-xs text-white flex items-center justify-between">
              <span className="truncate">treasury@capitalgrow.investments</span>
              <button
                onClick={() => handleCopy('treasury@capitalgrow.investments', 'email')}
                className="text-white/60 hover:text-white shrink-0 ml-2"
              >
                {copiedDesk === 'email' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a
              href="mailto:treasury@capitalgrow.investments?subject=CapitalGrow Investor Inquiry"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Compose Email</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SUPPORT TICKET */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-[20px] bg-[#131926] border border-white/10 text-white shadow-2xl p-6 space-y-5 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">Create Support Ticket</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Our Treasury Desk replies within 15 minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'deposit', label: 'Deposit Issue' },
                      { id: 'withdrawal', label: 'Withdrawal' },
                      { id: 'kyc', label: 'KYC Identity' },
                      { id: 'plan_inquiry', label: 'Investment Plan' },
                      { id: 'security', label: 'Security' },
                      { id: 'general', label: 'Other General' }
                    ] as const
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewCategory(cat.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                        newCategory === cat.id
                          ? 'bg-[#10B981] border-[#10B981] text-white shadow'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Priority
                </label>
                <div className="flex items-center gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold border text-center transition-colors ${
                        newPriority === p
                          ? p === 'urgent'
                            ? 'bg-[#E5484D] border-[#E5484D] text-white'
                            : p === 'high'
                            ? 'bg-[#F59E0B] border-[#F59E0B] text-black font-bold'
                            : 'bg-[#10B981] border-[#10B981] text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Related Transaction Reference (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Related Transaction (Optional)
                </label>
                <select
                  value={selectedTxnRef}
                  onChange={(e) => setSelectedTxnRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#10B981]"
                >
                  <option value="" className="bg-[#131926]">
                    -- None / General Inquiry --
                  </option>
                  {transactions.map((t) => (
                    <option key={t.id} value={t.referenceId} className="bg-[#131926]">
                      {t.type} • {formatCurrency(t.amount)} ({t.referenceId}) — {t.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deposit slip verification for Meezan Bank transfer"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Detailed Message / Notes
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide transaction ID, bank used, time of transfer, or specific question..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Submit / Cancel buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-medium shadow-md shadow-[#10B981]/25 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

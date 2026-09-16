import React, { useState } from 'react';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#10B981]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />;
      case 'danger':
        return <XCircle className="w-5 h-5 text-[#E5484D]" />;
      default:
        return <Info className="w-5 h-5 text-[#10B981]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        <div>
          <h2 className="font-heading text-2xl font-bold">Alerts & System Notifications</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Audit updates, deposit clearing, compliance notifications, and account security signals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0B0F17] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#10B981] text-white font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-[#10B981] text-white font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-[#10B981]" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#131926] rounded-[18px] border border-white/10 text-[#94A3B8] text-sm">
            No notifications matching your filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 rounded-[14px] border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                item.read
                  ? 'bg-[#131926]/60 border-white/5 hover:border-white/15'
                  : 'bg-[#131926] border-[#10B981]/40 shadow-md ring-1 ring-[#10B981]/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">{getIcon(item.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm text-white">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{item.description}</p>
                  <span className="text-[10px] font-mono text-[#64748B] mt-2 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(item.id);
                  }}
                  className="text-xs font-mono text-[#10B981] hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

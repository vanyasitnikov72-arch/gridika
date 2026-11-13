import { useState, useMemo, useEffect } from 'preact/hooks';
import type { AdminOrder, OrderEvent } from '../engine/adminOrders';
import {
  loadAdminOrders,
  saveAdminOrders,
  computeOrdersSummary,
  exportOrdersToCsv,
  isUserAuthenticated,
  setAuthenticated,
  INITIAL_ADMIN_ORDERS,
} from '../engine/adminOrders';
import { PRODUCTS, productById, type ProductId } from '../data/products';
import { ordersApi } from '../data/api';

export function AdminDashboard() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [token, setToken] = useState(() => (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('gridika_admin_token') || '' : ''));
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loading, setLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'refunded'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'single' | 'bundle' | 'studio'>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'today' | '7d' | '30d'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Selected order actions state
  const [resendEmail, setResendEmail] = useState('');
  const [showResendInput, setShowResendInput] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [editingNote, setEditingNote] = useState('');
  const [revenuePeriod, setRevenuePeriod] = useState<'today' | '7d' | '30d' | 'total'>('7d');
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');

  const fetchLiveOrders = async (authToken: string) => {
    const url = ordersApi('admin-orders');
    if (!url) return null;
    try {
      const res = await fetch(url, {
        headers: {
          'X-Admin-Secret': authToken,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.orders) ? data.orders : [];
      }
      return false; // invalid token
    } catch (err) {
      console.warn('Failed to reach orders API:', err);
      return null; // network / offline
    }
  };

  // Load state on mount
  useEffect(() => {
    const init = async () => {
      const savedToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('gridika_admin_token') : null;
      if (savedToken && ordersApi('admin-orders')) {
        const live = await fetchLiveOrders(savedToken);
        if (live && live !== false) {
          setOrders(live);
          setIsLiveApi(true);
          setAuthed(true);
          setToken(savedToken);
          return;
        }
      }

      if (isUserAuthenticated()) {
        setAuthed(true);
        setOrders(loadAdminOrders());
      }
    };
    init();
  }, []);

  const summary = useMemo(() => computeOrdersSummary(orders), [orders]);

  // Section 3.5: Customers / Buyers aggregation (LTV, order counts, agency detection)
  const customers = useMemo(() => {
    const map = new Map<string, { email: string; ordersCount: number; codesCount: number; totalSpend: number; lastOrderDate: string; effects: Set<string>; isStudio: boolean }>();

    orders.forEach((o) => {
      if (o.status !== 'paid') return;
      const prev = map.get(o.email) || {
        email: o.email,
        ordersCount: 0,
        codesCount: 0,
        totalSpend: 0,
        lastOrderDate: o.createdAt,
        effects: new Set<string>(),
        isStudio: false,
      };
      prev.ordersCount += 1;
      prev.codesCount += o.codesCount;
      prev.totalSpend += o.total;
      if (o.codesCount >= 7) prev.isStudio = true;
      if (new Date(o.createdAt).getTime() > new Date(prev.lastOrderDate).getTime()) {
        prev.lastOrderDate = o.createdAt;
      }
      o.items.forEach((it) => prev.effects.add(it.p));
      map.set(o.email, prev);
    });

    const list = Array.from(map.values()).map((c) => ({
      ...c,
      effectsList: Array.from(c.effects),
    }));

    list.sort((a, b) => b.totalSpend - a.totalSpend);
    return list;
  }, [orders]);

  // Handle Login
  const handleLogin = async (e: Event) => {
    e.preventDefault();
    const pass = password.trim();
    if (!pass) return;
    setLoading(true);
    setAuthError('');

    const liveUrl = ordersApi('admin-orders');
    if (liveUrl) {
      const result = await fetchLiveOrders(pass);
      setLoading(false);
      if (result === false) {
        setAuthError('Неверный пароль или доступ временно заблокирован');
        return;
      }
      if (result !== null) {
        setToken(pass);
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('gridika_admin_token', pass);
        setIsLiveApi(true);
        setOrders(result);
        setAuthed(true);
        return;
      }
      setAuthError('Не удалось подключиться к серверной функции в Yandex Cloud');
      return;
    }

    // Dev / Local fallback when ORDERS_API is not yet deployed
    setLoading(false);
    if (pass === 'Gr!d1ka_2281337#SecOps$94Kt') {
      setAuthenticated(true);
      setAuthed(true);
      setIsLiveApi(false);
      setOrders(loadAdminOrders());
    } else {
      setAuthError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setAuthed(false);
    setToken('');
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('gridika_admin_token');
    setSelectedOrder(null);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return orders.filter((o) => {
      // Search
      if (q) {
        const matchId = o.id.toLowerCase().includes(q);
        const matchEmail = o.email.toLowerCase().includes(q);
        const matchNote = (o.note || '').toLowerCase().includes(q);
        const matchEffect = o.items.some((it) => {
          const site = it.qr?.text || it.card?.contact?.site || it.gift?.settings?.url || '';
          return (it.p || '').toLowerCase().includes(q) || site.toLowerCase().includes(q);
        });
        if (!matchId && !matchEmail && !matchNote && !matchEffect) return false;
      }

      // Status
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      // Tier
      if (tierFilter === 'single' && o.codesCount !== 1) return false;
      if (tierFilter === 'bundle' && (o.codesCount < 2 || o.codesCount > 6)) return false;
      if (tierFilter === 'studio' && o.codesCount < 7) return false;

      // Period
      const age = now - new Date(o.createdAt).getTime();
      if (periodFilter === 'today' && age > dayMs) return false;
      if (periodFilter === '7d' && age > 7 * dayMs) return false;
      if (periodFilter === '30d' && age > 30 * dayMs) return false;

      return true;
    });
  }, [orders, search, statusFilter, tierFilter, periodFilter]);

  // Export CSV
  const handleExportCsv = () => {
    const csv = exportOrdersToCsv(filteredOrders);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gridika-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Order actions
  const openOrderDrawer = (o: AdminOrder) => {
    setSelectedOrder({
      ...o,
      events: Array.isArray(o.events) ? o.events : [],
      items: Array.isArray(o.items) ? o.items : [],
      discount: o.discount || 0,
      paymentProvider: o.paymentProvider || 'ЮKassa',
    });
    setEditingNote(o.note || '');
    setResendEmail(o.email || '');
    setShowResendInput(false);
    setActionSuccess('');
  };

  const handleSaveNote = () => {
    if (!selectedOrder) return;
    const updated = orders.map((o) => (o.id === selectedOrder.id ? { ...o, note: editingNote } : o));
    setOrders(updated);
    saveAdminOrders(updated);
    setSelectedOrder({ ...selectedOrder, note: editingNote });
    setActionSuccess('Заметка сохранена');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handleResend = async () => {
    if (!selectedOrder) return;
    const targetEmail = resendEmail.trim() || selectedOrder.email;
    if (!targetEmail.includes('@') || !targetEmail.includes('.')) {
      setActionSuccess('Укажите корректный email');
      return;
    }

    if (isLiveApi && ordersApi('admin-resend')) {
      try {
        const res = await fetch(ordersApi('admin-resend'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': token,
          },
          body: JSON.stringify({ orderId: selectedOrder.id, targetEmail }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка отправки письма');
      } catch (err: any) {
        alert(`Ошибка отправки: ${err.message}`);
        return;
      }
    }

    const nowStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const newEvent: OrderEvent = {
      id: 'ev-' + Date.now(),
      time: nowStr,
      type: 'email_resent',
      text: `Письмо переслано на ${targetEmail}`,
    };

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          email: targetEmail,
          emailStatus: 'resent' as const,
          events: [newEvent, ...(Array.isArray(o.events) ? o.events : [])],
        };
      }
      return o;
    });

    setOrders(updated);
    if (!isLiveApi) saveAdminOrders(updated);
    setSelectedOrder({
      ...selectedOrder,
      email: targetEmail,
      emailStatus: 'resent',
      events: [newEvent, ...(Array.isArray(selectedOrder.events) ? selectedOrder.events : [])],
    });
    setShowResendInput(false);
    setActionSuccess(`Письмо успешно отправлено на ${targetEmail}`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    if (!confirm(`Подтвердите возврат ${selectedOrder.total} ₽ по заказу ${selectedOrder.id}?`)) return;

    if (isLiveApi && ordersApi('admin-refund')) {
      try {
        const res = await fetch(ordersApi('admin-refund'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': token,
          },
          body: JSON.stringify({ orderId: selectedOrder.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка возврата через ЮKassa');
      } catch (err: any) {
        alert(`Ошибка возврата: ${err.message}`);
        return;
      }
    }

    const nowStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const newEvent: OrderEvent = {
      id: 'ev-' + Date.now(),
      time: nowStr,
      type: 'refund',
      text: `Возврат ${selectedOrder.total} ₽ подтверждён через ЮKassa`,
    };

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          status: 'refunded' as const,
          events: [newEvent, ...(Array.isArray(o.events) ? o.events : [])],
        };
      }
      return o;
    });

    setOrders(updated);
    if (!isLiveApi) saveAdminOrders(updated);
    setSelectedOrder({
      ...selectedOrder,
      status: 'refunded',
      events: [newEvent, ...(Array.isArray(selectedOrder.events) ? selectedOrder.events : [])],
    });
    setActionSuccess(`Статус заказа изменён на «Возврат»`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleResetData = () => {
    if (confirm('Сбросить данные к начальным примерам?')) {
      setOrders(INITIAL_ADMIN_ORDERS);
      saveAdminOrders(INITIAL_ADMIN_ORDERS);
      setSelectedOrder(null);
    }
  };

  // Helper product badge styling
  const getProductBadge = (pId: string) => {
    const prod = productById(pId as ProductId);
    return {
      title: prod?.title || pId,
      color: pId === 'qr-morph' ? 'bg-[#DFF8EB] text-[#0f5c3c]' : pId === 'qr-card' ? 'bg-[#ede9fe] text-[#5b21b6]' : pId === 'gift-box' ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#e0f2fe] text-[#0369a1]',
    };
  };

  // Format currency
  const rub = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

  // 1. LOGIN GATE
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-[#ebe5da] rounded-[32px] p-8 sm:p-10 shadow-[0_30px_70px_-25px_rgba(19,42,34,0.3)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#132A22] text-[#19C37D] flex items-center justify-center shadow-md">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1 className="mt-5 text-2xl sm:text-3xl font-black text-[#132A22] tracking-tight">Панель управления</h1>
            <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#6b645c]">
              Заказы, клиенты и статистика Gridika
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#78716c] mb-1.5">
                Пароль администратора
              </label>
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="Введите пароль..."
                autoFocus
                className="w-full h-12 px-4 rounded-2xl bg-[#f6f3ee] border border-[#e5dfd2] text-[#132A22] font-semibold text-sm focus:outline-none focus:border-[#19C37D] focus:ring-2 focus:ring-[#19C37D]/20 transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-[#fff1f2] border border-[#ffe4e6] text-xs font-bold text-[#be123c] leading-snug">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-full bg-[#132A22] hover:bg-[#1d3a2f] text-[#F0EBE9] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Проверка...' : 'Войти в систему'}</span>
              <span className="w-5 h-5 rounded-full bg-[#19C37D] text-[#132A22] text-xs font-black flex items-center justify-center">→</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  const currentRev =
    revenuePeriod === 'today'
      ? summary.revenueToday
      : revenuePeriod === '7d'
      ? summary.revenue7d
      : revenuePeriod === '30d'
      ? summary.revenue30d
      : summary.revenueTotal;

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <header className="pt-6 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e5dfd2]">
        <div className="flex items-center gap-3.5">
          <a href="/" className="w-10 h-10 rounded-xl bg-[#132A22] text-[#19C37D] flex items-center justify-center font-black shadow-sm" title="На главную Gridika">
            G
          </a>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#132A22] tracking-tight">Заказы Gridika</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#DFF8EB] text-[#0f5c3c] text-[10px] font-black uppercase tracking-wider">
                Админка
              </span>
              {isLiveApi ? (
                <span className="px-2 py-0.5 rounded-full bg-[#DFF8EB] text-[#0f5c3c] text-[10px] font-bold">
                  ● Онлайн API
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold" title="Для подключения реальных заказов укажите URL функции в src/data/api.ts">
                  ● Демо (локальные заказы)
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#78716c]">Управление покупками, отправкой и кодами</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 px-3.5 rounded-full bg-white hover:bg-[#f6f3ee] border border-[#e5dfd2] text-xs font-black text-[#132A22] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="Выгрузить отфильтрованные заказы в CSV (для Мой налог)"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Экспорт в CSV</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3.5 rounded-full bg-white hover:bg-[#f6f3ee] border border-[#e5dfd2] text-xs font-black text-[#132A22] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>В студию ↗</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="h-9 px-3 rounded-full bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] text-xs font-black transition-colors cursor-pointer"
          >
            Выйти
          </button>
        </div>
      </header>

      {/* METRICS DASHBOARD (Section 3.2) */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue with switcher */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-10px_rgba(19,42,34,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#a8a29e]">Выручка</span>
            <div className="flex bg-[#f6f3ee] p-0.5 rounded-lg text-[10px] font-black">
              {(['today', '7d', '30d', 'total'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setRevenuePeriod(p)}
                  className={`px-1.5 py-0.5 rounded ${revenuePeriod === p ? 'bg-white text-[#132A22] shadow-sm' : 'text-[#78716c] hover:text-[#132A22]'}`}
                >
                  {p === 'today' ? '1д' : p === '7d' ? '7д' : p === '30d' ? '30д' : 'Все'}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight">{rub(currentRev)}</div>
            <div className="mt-1 text-xs font-bold text-[#19C37D] flex items-center gap-1">
              <span>●</span>
              <span>{revenuePeriod === 'today' ? 'за сегодня' : revenuePeriod === '7d' ? 'за 7 дней' : revenuePeriod === '30d' ? 'за месяц' : 'за всё время'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Orders & Avg Check */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-10px_rgba(19,42,34,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#a8a29e]">Заказы</span>
            <span className="w-6 h-6 rounded-full bg-[#f6f3ee] flex items-center justify-center text-xs font-black text-[#132A22]">📦</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight">{summary.ordersCount}</div>
            <div className="mt-1 text-xs font-semibold text-[#57534e]">
              Средний чек: <b className="text-[#132A22] font-black">{rub(summary.averageCheck)}</b>
            </div>
          </div>
        </div>

        {/* Card 3: Total Codes & Tier Split */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-10px_rgba(19,42,34,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#a8a29e]">Выдано кодов</span>
            <span className="w-6 h-6 rounded-full bg-[#f6f3ee] flex items-center justify-center text-xs font-black text-[#132A22]">⚡</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight">{summary.codesCount}</div>
            <div className="mt-1 text-[11px] font-bold text-[#78716c] flex items-center gap-1.5 flex-wrap">
              <span className="text-[#132A22] font-black">{summary.tierCounts.single}</span> 1 код ·
              <span className="text-[#19C37D] font-black">{summary.tierCounts.bundle}</span> компл ·
              <span className="text-[#8b5cf6] font-black">{summary.tierCounts.studio}</span> пакет
            </div>
          </div>
        </div>

        {/* Card 4: Delivery alerts & refunds */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-10px_rgba(19,42,34,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#a8a29e]">Контроль писем</span>
            <span className="w-6 h-6 rounded-full bg-[#DFF8EB] text-[#0f5c3c] flex items-center justify-center text-xs font-black">✓</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight">100%</div>
            <div className="mt-1 text-xs font-semibold text-[#57534e]">
              Возвратов: <b className={summary.alerts.refunds > 0 ? 'text-[#be123c] font-black' : 'text-[#132A22] font-black'}>{summary.alerts.refunds}</b>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR EFFECTS BAR (Section 3.2) */}
      <section className="mt-4 bg-white border border-[#ebe5da] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-10px_rgba(19,42,34,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#a8a29e]">Популярность эффектов в заказах</h2>
          <span className="text-xs font-semibold text-[#78716c]">Всего куплено копий: {summary.codesCount}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {PRODUCTS.slice(0, 6).map((prod) => {
            const count = summary.productCounts[prod.id] || 0;
            const pct = summary.codesCount > 0 ? Math.round((count / summary.codesCount) * 100) : 0;
            return (
              <div key={prod.id} className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#ede7db] flex flex-col justify-between">
                <div className="text-[11px] font-black text-[#132A22] truncate" title={prod.title}>
                  {prod.title}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-[#132A22]">{count}</span>
                  <span className="text-[11px] font-bold text-[#19C37D]">{pct}%</span>
                </div>
                <div className="mt-1.5 w-full bg-[#ede7db] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#19C37D] h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TABS: Orders vs Customers (Section 3.5) */}
      <div className="mt-8 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`h-10 px-5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#132A22] text-white shadow-md'
              : 'bg-white hover:bg-[#f6f3ee] text-[#78716c] border border-[#e5dfd2]'
          }`}
        >
          <span>📦 Заказы</span>
          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${activeTab === 'orders' ? 'bg-[#19C37D] text-[#132A22]' : 'bg-[#f6f3ee] text-[#78716c]'}`}>
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`h-10 px-5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'bg-[#132A22] text-white shadow-md'
              : 'bg-white hover:bg-[#f6f3ee] text-[#78716c] border border-[#e5dfd2]'
          }`}
        >
          <span>👥 Покупатели</span>
          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${activeTab === 'customers' ? 'bg-[#19C37D] text-[#132A22]' : 'bg-[#f6f3ee] text-[#78716c]'}`}>
            {customers.length}
          </span>
        </button>
      </div>

      {activeTab === 'customers' ? (
        /* CUSTOMERS TABLE (Section 3.5) */
        <section className="mt-4 bg-white border border-[#ebe5da] rounded-3xl overflow-hidden shadow-[0_12px_30px_-15px_rgba(19,42,34,0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbf9f5] border-b border-[#ede7db] text-[10.5px] font-black uppercase tracking-wider text-[#a8a29e]">
                  <th className="py-3.5 pl-6 pr-3">Покупатель (Email)</th>
                  <th className="py-3.5 px-3">Статус / Сегмент</th>
                  <th className="py-3.5 px-3 text-center">Заказов</th>
                  <th className="py-3.5 px-3 text-center">Всего кодов</th>
                  <th className="py-3.5 px-3 text-right">Общая сумма (LTV)</th>
                  <th className="py-3.5 px-3">Купленные эффекты</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Последний заказ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3efe7] text-xs font-semibold text-[#44403c]">
                {customers.map((c) => {
                  const lastDate = new Date(c.lastOrderDate).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <tr
                      key={c.email}
                      onClick={() => {
                        setSearch(c.email);
                        setActiveTab('orders');
                      }}
                      className="hover:bg-[#faf7f2] transition-colors cursor-pointer group"
                      title="Нажмите, чтобы показать все заказы этого покупателя"
                    >
                      <td className="py-4 pl-6 pr-3 font-bold text-[#132A22]">
                        <span className="group-hover:text-[#19C37D] transition-colors">{c.email}</span>
                      </td>
                      <td className="py-4 px-3 whitespace-nowrap">
                        {c.isStudio ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#ede9fe] text-[#5b21b6] text-[10.5px] font-black">
                            Студия (пакет)
                          </span>
                        ) : c.ordersCount > 1 ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#DFF8EB] text-[#0f5c3c] text-[10.5px] font-black">
                            Постоянный клиент
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-[#f6f3ee] text-[#57534e] text-[10.5px] font-bold">
                            Клиент
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center font-bold text-[#132A22]">{c.ordersCount}</td>
                      <td className="py-4 px-3 text-center font-black text-[#132A22]">{c.codesCount}</td>
                      <td className="py-4 px-3 text-right font-black text-[#19C37D]">{rub(c.totalSpend)}</td>
                      <td className="py-4 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {c.effectsList.map((pId) => {
                            const b = getProductBadge(pId);
                            return (
                              <span key={pId} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${b.color}`}>
                                {b.title}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-4 pl-3 pr-6 text-right text-[#78716c] whitespace-nowrap">{lastDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <>
          {/* SEARCH AND FILTERS TOOLBAR (Section 3.3) */}
          <section className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="Поиск по номеру заказа (GR-...), email или сайту..."
              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-[#e5dfd2] text-[#132A22] font-semibold text-xs sm:text-sm focus:outline-none focus:border-[#19C37D] shadow-sm transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#a8a29e] hover:text-[#132A22]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value as any)}
              className="h-11 px-3 rounded-2xl bg-white border border-[#e5dfd2] text-xs font-bold text-[#132A22] shadow-sm focus:outline-none focus:border-[#19C37D] cursor-pointer"
            >
              <option value="all">Все статусы</option>
              <option value="paid">Оплачен</option>
              <option value="refunded">Возврат</option>
            </select>

            {/* Tier filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter((e.target as HTMLSelectElement).value as any)}
              className="h-11 px-3 rounded-2xl bg-white border border-[#e5dfd2] text-xs font-bold text-[#132A22] shadow-sm focus:outline-none focus:border-[#19C37D] cursor-pointer"
            >
              <option value="all">Все тарифы</option>
              <option value="single">1 код</option>
              <option value="bundle">Комплект (2–6)</option>
              <option value="studio">Пакет (7+)</option>
            </select>

            {/* Period filter */}
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter((e.target as HTMLSelectElement).value as any)}
              className="h-11 px-3 rounded-2xl bg-white border border-[#e5dfd2] text-xs font-bold text-[#132A22] shadow-sm focus:outline-none focus:border-[#19C37D] cursor-pointer"
            >
              <option value="all">За всё время</option>
              <option value="today">Сегодня</option>
              <option value="7d">За 7 дней</option>
              <option value="30d">За 30 дней</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-[#78716c] px-1">
          <span>
            Найдено: <b className="text-[#132A22]">{filteredOrders.length}</b> заказов на сумму{' '}
            <b className="text-[#19C37D]">{rub(filteredOrders.reduce((sum, o) => sum + (o.status === 'paid' ? o.total : 0), 0))}</b>
          </span>
          <button
            type="button"
            onClick={handleResetData}
            className="text-[11px] font-semibold text-[#a8a29e] hover:text-[#132A22] underline cursor-pointer"
          >
            Сбросить к демо-данным
          </button>
        </div>
      </section>

      {/* ORDERS TABLE (Section 3.3) */}
      <section className="mt-4 bg-white border border-[#ebe5da] rounded-3xl overflow-hidden shadow-[0_12px_30px_-15px_rgba(19,42,34,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf9f5] border-b border-[#ede7db] text-[10.5px] font-black uppercase tracking-wider text-[#a8a29e]">
                <th className="py-3.5 pl-6 pr-3">Номер</th>
                <th className="py-3.5 px-3">Дата</th>
                <th className="py-3.5 px-3">Email покупателя</th>
                <th className="py-3.5 px-3">Купленные эффекты</th>
                <th className="py-3.5 px-3 text-center">Кодов</th>
                <th className="py-3.5 px-3 text-right">Сумма</th>
                <th className="py-3.5 px-3 text-center">Статус</th>
                <th className="py-3.5 px-3 text-center">Письмо</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3efe7] text-xs font-semibold text-[#44403c]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#a8a29e]">
                    По заданным критериям заказов не найдено.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const dateStr = new Date(o.createdAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={o.id}
                      onClick={() => openOrderDrawer(o)}
                      className="hover:bg-[#faf7f2] transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-4 pl-6 pr-3 font-mono font-bold text-[#132A22]">
                        <span className="group-hover:text-[#19C37D] transition-colors">{o.id}</span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-3 text-[#78716c] whitespace-nowrap">{dateStr}</td>

                      {/* Email + Source */}
                      <td className="py-4 px-3">
                        <div className="font-bold text-[#132A22]">{o.email}</div>
                        {o.source && (
                          <div className="text-[10.5px] font-semibold text-[#a8a29e] truncate max-w-[160px]">
                            {o.source}
                          </div>
                        )}
                      </td>

                      {/* Effects */}
                      <td className="py-4 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {o.items.slice(0, 3).map((it, idx) => {
                            const b = getProductBadge(it.p);
                            return (
                              <span key={idx} className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold ${b.color} truncate max-w-[120px]`}>
                                {b.title}
                              </span>
                            );
                          })}
                          {o.items.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#f3efe7] text-[#78716c] text-[10px] font-black">
                              +{o.items.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Codes count */}
                      <td className="py-4 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#f6f3ee] text-[11px] font-black text-[#132A22]">
                          {o.codesCount}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-3 text-right whitespace-nowrap font-black text-[#132A22]">
                        {rub(o.total)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {o.status === 'paid' ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#DFF8EB] text-[#0f5c3c] text-[10.5px] font-black">
                            Оплачен
                          </span>
                        ) : o.status === 'refunded' ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#fee2e2] text-[#991b1b] text-[10.5px] font-black">
                            Возврат
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-[10.5px] font-black">
                            Ошибка
                          </span>
                        )}
                      </td>

                      {/* Email Status */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {o.emailStatus === 'sent' ? (
                          <span className="text-[#19C37D] font-bold text-xs" title="Письмо отправлено">
                            ✓ отправлено
                          </span>
                        ) : o.emailStatus === 'resent' ? (
                          <span className="text-[#0284c7] font-bold text-xs" title="Письмо переслано повторно">
                            ↻ переслано
                          </span>
                        ) : (
                          <span className="text-[#dc2626] font-bold text-xs">✕ сбой</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDrawer(o);
                          }}
                          className="text-xs font-black text-[#19C37D] hover:text-[#132A22] group-hover:translate-x-1 inline-flex items-center gap-1 transition-all cursor-pointer py-1 px-2.5 rounded-full hover:bg-[#DFF8EB]"
                        >
                          Подробнее →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
      </>
      )}

      {/* ORDER DETAILS DRAWER / MODAL (Section 3.4) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#ebe5da] rounded-[28px] sm:rounded-[32px] w-full max-w-2xl max-w-[calc(100vw-24px)] max-h-[92vh] flex flex-col shadow-[0_30px_90px_-20px_rgba(19,42,34,0.4)] overflow-hidden">
            {/* Drawer Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#ede7db] flex items-center justify-between bg-[#fbf9f5]">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-mono text-lg sm:text-xl font-black text-[#132A22]">{selectedOrder.id}</span>
                {selectedOrder.status === 'paid' ? (
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#DFF8EB] text-[#0f5c3c] text-[10.5px] sm:text-[11px] font-black">
                    Оплачен
                  </span>
                ) : (
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] text-[10.5px] sm:text-[11px] font-black">
                    Возврат
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white border border-[#e5dfd2] text-[#78716c] hover:text-[#132A22] flex items-center justify-center font-black transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 sm:gap-6">
              {actionSuccess && (
                <div className="p-3 rounded-2xl bg-[#DFF8EB] border border-[#a7f3d0] text-xs font-black text-[#065f46]">
                  ✓ {actionSuccess}
                </div>
              )}

              {/* Order Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#f6f3ee]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] block">Сумма</span>
                  <span className="text-sm sm:text-base font-black text-[#132A22]">{rub(selectedOrder.total)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] block">Скидка</span>
                  <span className="text-sm sm:text-base font-black text-[#19C37D]">{rub(selectedOrder.discount)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] block">Кодов</span>
                  <span className="text-sm sm:text-base font-black text-[#132A22]">{selectedOrder.codesCount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] block">Провайдер</span>
                  <span className="text-[11px] sm:text-xs font-black text-[#132A22] uppercase">{selectedOrder.paymentProvider}</span>
                </div>
              </div>

              {/* Customer Email & Resend Email Action */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#ebe5da] flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-[#a8a29e]">Email покупателя</span>
                    <div className="font-black text-sm text-[#132A22] mt-0.5 break-all">{selectedOrder.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResendInput(!showResendInput)}
                    className="self-start sm:self-auto h-8 px-3 rounded-full bg-[#f6f3ee] hover:bg-[#e9e3d7] text-xs font-black text-[#132A22] transition-colors cursor-pointer shrink-0"
                  >
                    ✉️ Переслать письмо
                  </button>
                </div>

                {showResendInput && (
                  <div className="pt-3 border-t border-[#f0ebe1] flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={resendEmail}
                      onInput={(e) => setResendEmail((e.target as HTMLInputElement).value)}
                      placeholder="Адрес для пересылки..."
                      className="flex-1 h-9 px-3 rounded-xl bg-[#f6f3ee] border border-[#e5dfd2] text-xs font-bold text-[#132A22]"
                    />
                    <button
                      type="button"
                      onClick={handleResend}
                      className="h-9 px-4 rounded-xl bg-[#132A22] hover:bg-[#1d3a2f] text-white text-xs font-black transition-colors cursor-pointer shrink-0"
                    >
                      Отправить повторно
                    </button>
                  </div>
                )}
              </div>

              {/* Bought Effects List */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#a8a29e] mb-2.5">
                  Эффекты в заказе ({(selectedOrder.items || []).length})
                </h3>
                <div className="flex flex-col gap-2">
                  {(selectedOrder.items || []).map((it, idx) => {
                    const prod = productById(it.p) || { title: it.p, id: it.p, theme: { accent: '#19C37D' } };
                    const targetLink = it.qr?.text || it.card?.contact?.site || it.gift?.settings?.url || '—';

                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#ede7db] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-white border border-[#e5dfd2] text-xs font-black flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-[#132A22] truncate">{prod.title}</div>
                            <div className="text-[11px] font-medium text-[#78716c] truncate">
                              Ссылка: <span className="font-mono text-[#132A22] font-semibold">{targetLink}</span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={`/?fx=${it.p}#studio`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-3 rounded-full bg-white hover:bg-[#f6f3ee] border border-[#e5dfd2] text-[11px] font-black text-[#132A22] shrink-0 transition-colors flex items-center gap-1"
                        >
                          <span>В студии</span>
                          <span>↗</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions (Open thanks page / Refund) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={selectedOrder.orderUrl || (selectedOrder.status === 'paid' ? `/thanks#order=${selectedOrder.id}` : '#')}
                  target={selectedOrder.orderUrl || selectedOrder.status === 'paid' ? '_blank' : undefined}
                  rel="noreferrer"
                  className={`h-10 px-4 rounded-full text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors ${
                    selectedOrder.orderUrl || selectedOrder.status === 'paid'
                      ? 'bg-[#132A22] hover:bg-[#1d3a2f] cursor-pointer'
                      : 'bg-[#a8a29e] opacity-60 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!selectedOrder.orderUrl && selectedOrder.status !== 'paid') {
                      e.preventDefault();
                      alert('Ссылка на страницу выдачи кода доступна только для оплаченных заказов.');
                    }
                  }}
                >
                  <span>🔗 Открыть страницу заказа покупателя</span>
                  <span>↗</span>
                </a>

                {selectedOrder.status === 'paid' && (
                  <button
                    type="button"
                    onClick={handleRefund}
                    className="h-10 px-4 rounded-full bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] text-xs font-black transition-colors cursor-pointer"
                  >
                    Вернуть деньги
                  </button>
                )}
              </div>

              {/* Admin Note */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#ede7db]">
                <label className="block text-[10.5px] font-black uppercase tracking-wider text-[#a8a29e] mb-1.5">
                  Заметка администратора
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingNote}
                    onInput={(e) => setEditingNote((e.target as HTMLInputElement).value)}
                    placeholder="Например: просил поменять ссылку на сайт..."
                    className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#e5dfd2] text-xs font-bold text-[#132A22]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="h-9 px-3.5 rounded-xl bg-[#132A22] hover:bg-[#1d3a2f] text-white text-xs font-black cursor-pointer shrink-0"
                  >
                    Сохранить
                  </button>
                </div>
              </div>

              {/* Events Log (Section 2) */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#a8a29e] mb-2.5">
                  Журнал событий {selectedOrder.events?.length ? `(${selectedOrder.events.length})` : ''}
                </h3>
                {selectedOrder.events && selectedOrder.events.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {selectedOrder.events.map((ev) => (
                      <div key={ev.id} className="text-xs p-2.5 rounded-xl bg-[#f6f3ee] flex items-start gap-2.5">
                        <span className="font-mono text-[10.5px] font-black text-[#78716c] whitespace-nowrap mt-0.5">
                          {ev.time}
                        </span>
                        <span className="font-semibold text-[#44403c] leading-snug">{ev.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs p-3 rounded-xl bg-[#f6f3ee] text-[#78716c] font-medium">
                    {selectedOrder.status === 'paid'
                      ? `Оплата подтверждена через ${selectedOrder.paymentProvider || 'ЮKassa'} (ID: ${selectedOrder.paymentId || '—'})`
                      : `Статус: ${selectedOrder.status === 'refunded' ? 'Возврат средств оформлен' : 'Ожидает оплаты / Отменен'}`}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#ede7db] bg-[#fbf9f5] flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-semibold text-[#a8a29e] truncate flex-1 min-w-0">
                ID: {selectedOrder.paymentId}
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="h-8.5 sm:h-9 px-4 rounded-full bg-[#132A22] text-white text-xs font-black cursor-pointer shrink-0"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

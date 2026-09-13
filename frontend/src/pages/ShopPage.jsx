import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/sound';
import AnimatedNumber from '../components/common/AnimatedNumber';
import { notify } from '../components/common/ToastContainer';
import {
  Shield,
  Gamepad2,
  Tv,
  Coffee,
  Palette,
  Moon,
  Coins,
  Sparkles,
  Check,
} from 'lucide-react';

const ICON_MAP = {
  Shield: Shield,
  Gamepad2: Gamepad2,
  Tv: Tv,
  Coffee: Coffee,
  Palette: Palette,
  Moon: Moon,
};

export default function ShopPage() {
  const { user, character, updateCharacterState, setActiveTheme } = useAuth();
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'inventory'
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [equipping, setEquipping] = useState(null);
  const [message, setMessage] = useState('');

  const gold = character?.gold ?? 0;
  const freezeCount = character?.streaks?.freeze_count ?? character?.streaks?.freezeCount ?? 0;

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [catRes, invRes] = await Promise.all([
        api.get('/rewards'),
        api.get('/rewards/inventory'),
      ]);
      if (catRes.data.success) {
        setItems(catRes.data.data);
      }
      if (invRes.data.success) {
        setInventory(invRes.data.data);
        const equippedTheme = invRes.data.data.find((i) => i.category === 'theme' && i.is_equipped);
        if (equippedTheme) {
          if (equippedTheme.reward_id === 'item_cyberpunk_theme') setActiveTheme('theme-cyberpunk');
          else if (equippedTheme.reward_id === 'item_midnight_theme') setActiveTheme('theme-midnight');
        }
      }
    } catch (err) {
      const isAuthErr =
        err?.message?.includes('Access denied') ||
        err?.message?.includes('expired') ||
        err?.message?.includes('token');
      if (user && !isAuthErr) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleBuy = async (itemId, cost) => {
    if (gold < cost) {
      notify.error('Insufficient Gold', `You require ${cost} Gold to redeem this reward.`);
      setMessage(`Insufficient Gold. You require ${cost} Gold.`);
      return;
    }

    try {
      setPurchasing(itemId);
      sounds.playCoin();
      const res = await api.post('/rewards/buy', { itemId });
      if (res.data.success) {
        notify.success('Reward Redeemed! 🎉', res.data.message || 'Reward added to your inventory.');
        setMessage(res.data.message);
        updateCharacterState({
          gold: res.data.data.remainingGold,
          streaks: {
            ...character.streaks,
            freeze_count: itemId === 'item_streak_freeze' ? freezeCount + 1 : freezeCount,
          },
        });
        fetchData();
      }
    } catch (err) {
      notify.error('Purchase Failed', err.message);
      setMessage(err.message);
    } finally {
      setPurchasing(null);
    }
  };

  const handleEquip = async (itemId) => {
    try {
      setEquipping(itemId);
      sounds.playLevelUp();
      const res = await api.post('/rewards/equip', { itemId });
      if (res.data.success) {
        notify.success('Theme Applied! ✨', 'Your visual theme has been updated.');
        setMessage('Theme equipped.');
        if (itemId === 'item_cyberpunk_theme') setActiveTheme('theme-cyberpunk');
        else if (itemId === 'item_midnight_theme') setActiveTheme('theme-midnight');
        else setActiveTheme('default');
        fetchData();
      }
    } catch (err) {
      notify.error('Equip Failed', err.message);
      setMessage(err.message);
    } finally {
      setEquipping(null);
    }
  };

  return (
    <div className="space-y-6 select-none max-w-[1000px] mx-auto pb-12 animate-fadeIn">
      {/* Header: REWARDS */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-wide">
            REWARDS
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Use your earned Gold to redeem personal rewards and track milestones.
          </p>
          <div className="font-display text-lg sm:text-xl font-black text-[var(--gold)] tracking-wide mt-2 flex items-center gap-1.5">
            <Coins className="h-5 w-5 text-[var(--gold)]" />
            <AnimatedNumber value={gold} /> <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Gold Available</span>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex gap-4 text-xs font-sans font-semibold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-1 border-b-2 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-[var(--accent)] text-[var(--accent)] font-bold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Available Rewards
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-1 border-b-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-[var(--accent)] text-[var(--accent)] font-bold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Your Rewards ({inventory.length})
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-xs text-[var(--text-primary)] flex items-center justify-between animate-fadeIn">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4 animate-fadeIn">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-36 rounded-2xl skeleton-shimmer border border-[var(--border)]" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {items.map((item) => {
                const Icon = ICON_MAP[item.icon] || Shield;
                const canAfford = gold >= item.cost;
                const isOwnedTheme = item.category === 'theme' && Number(item.owned_quantity) > 0;

                return (
                  <div
                    key={item.id}
                    className="mettle-card-interactive rounded-2xl p-5 flex flex-col justify-between bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--accent)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-display text-xs font-black text-[var(--gold)] bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {item.cost} GOLD
                        </span>
                      </div>
                      <h4 className="font-sans text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBuy(item.id, item.cost)}
                      disabled={purchasing === item.id || isOwnedTheme}
                      className={`mt-5 w-full py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isOwnedTheme
                          ? 'bg-transparent border border-[var(--border)] text-[var(--text-muted)] cursor-default'
                          : canAfford
                          ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] shadow-md shadow-[var(--accent)]/20 active:scale-95'
                          : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed opacity-60'
                      }`}
                    >
                      {purchasing === item.id
                        ? 'Purchasing...'
                        : isOwnedTheme
                        ? 'Owned ✓'
                        : canAfford
                        ? 'Redeem Reward'
                        : 'Insufficient Gold'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="mettle-panel rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border)] shadow-md animate-fadeIn">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block mb-4">
            Your Claimed Rewards
          </span>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-16 rounded-xl skeleton-shimmer border border-[var(--border)]" />
              ))}
            </div>
          ) : inventory.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-[var(--text-muted)] space-y-2">
              <Coins className="h-8 w-8 mx-auto text-[var(--text-muted)] opacity-50" />
              <p>No rewards unlocked yet.</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Redeem rewards from the catalog using gold earned by completing quests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inventory.map((inv) => (
                <div
                  key={inv.id}
                  className="mettle-card-interactive flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]"
                >
                  <div>
                    <h4 className="font-sans text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      {inv.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {inv.description} (Qty: {inv.quantity})
                    </p>
                  </div>

                  {inv.category === 'theme' ? (
                    <button
                      onClick={() => handleEquip(inv.reward_id)}
                      disabled={equipping === inv.reward_id || inv.is_equipped}
                      className={`px-4 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                        inv.is_equipped
                          ? 'bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] cursor-default'
                          : 'bg-[var(--bg-primary)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-text)]'
                      }`}
                    >
                      {inv.is_equipped ? 'Equipped ✓' : equipping === inv.reward_id ? 'Equipping...' : 'Equip'}
                    </button>
                  ) : (
                    <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-1 rounded-full border border-[var(--accent-border)]">
                      ×{inv.quantity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

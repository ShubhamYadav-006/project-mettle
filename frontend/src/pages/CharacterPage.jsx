import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import RadarChart from '../components/RadarChart';
import { Trophy, Info } from 'lucide-react';

export default function CharacterPage() {
  const { user, character } = useAuth();
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('sheet'); // 'sheet' | 'badges' | 'history'
  const [showFormula, setShowFormula] = useState(false);

  const level = character?.level ?? 1;
  const title = character?.title ?? 'Novice Scholar';
  const totalXp = character?.totalXp ?? character?.total_xp ?? 0;
  const mettleScore = character?.mettleScore ?? character?.mettle_score ?? 0;
  const attributes = character?.attributes || {
    intellect: 10,
    discipline: 10,
    strength: 10,
    creativity: 10,
    consistency: 10,
  };

  useEffect(() => {
    const fetchExtraData = async () => {
      if (!user) return;
      try {
        const [badgesRes, activityRes] = await Promise.all([
          api.get('/badges'),
          api.get('/activity'),
        ]);
        if (badgesRes.data.success) setBadges(badgesRes.data.data);
        if (activityRes.data.success) setActivities(activityRes.data.data);
      } catch (err) {
        const isAuthErr =
          err?.message?.includes('Access denied') ||
          err?.message?.includes('expired') ||
          err?.message?.includes('token');
        if (user && !isAuthErr) console.error('Failed to load character data', err);
      }
    };
    if (user) {
      fetchExtraData();
    }
  }, [user]);

  const attributeList = [
    { label: 'Intellect', sub: 'Mind', key: 'intellect', val: attributes.intellect ?? 10, desc: 'Academics, learning, deep work & problem-solving.', color: 'var(--attr-mind, #5B8DEF)' },
    { label: 'Discipline', sub: 'Will', key: 'discipline', val: attributes.discipline ?? 10, desc: 'Morning routines, daily adherence & self-control.', color: 'var(--attr-will, #B5E34A)' },
    { label: 'Strength', sub: 'Body', key: 'strength', val: attributes.strength ?? 10, desc: 'Fitness, health, workouts & physical training.', color: 'var(--attr-body, #3FA56F)' },
    { label: 'Creativity', sub: 'Craft', key: 'creativity', val: attributes.creativity ?? 10, desc: 'Design, building projects, writing & innovation.', color: 'var(--attr-craft, #9B7AC7)' },
    { label: 'Consistency', sub: 'Habit', key: 'consistency', val: attributes.consistency ?? 10, desc: 'Unbroken daily habit streaks & momentum.', color: 'var(--attr-habit, #C99628)' },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-wide">
            CHARACTER
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            View your attributes, XP, level, achievements, and overall progress.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex gap-4 text-xs font-sans font-semibold">
          <button
            onClick={() => setActiveSubTab('sheet')}
            className={`pb-1 border-b-2 transition-colors ${
              activeSubTab === 'sheet'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('badges')}
            className={`pb-1 border-b-2 transition-colors ${
              activeSubTab === 'badges'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Achievements ({badges.filter((b) => b.is_unlocked).length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-1 border-b-2 transition-colors ${
              activeSubTab === 'history'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Activity History
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CHARACTER SHEET */}
      {activeSubTab === 'sheet' && (
        <div className="space-y-6">
          {/* Identity & Core Metrics Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Identity & Radar */}
            <div className="md:col-span-6 mettle-panel rounded-md p-6 flex flex-col justify-between bg-[var(--bg-surface)]">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Character Profile
                    </span>
                    <h2 className="font-display text-2xl font-black text-[var(--text-primary)]">
                      {user?.name || 'Member'}
                    </h2>
                    <p className="font-sans text-xs font-semibold text-[var(--text-secondary)] mt-0.5">
                      {title}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block">
                      Level
                    </span>
                    <span className="font-display text-3xl font-black text-[var(--accent)]">
                      {level}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[var(--border)]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Total Experience
                    </span>
                    <p className="font-display text-lg font-black text-[var(--text-primary)]">
                      {Number(totalXp).toLocaleString()} <span className="text-xs text-[var(--text-muted)]">XP</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Mettle Score
                    </span>
                    <p className="font-display text-lg font-black text-[var(--text-primary)]">
                      {mettleScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5-Axis Radar Map */}
              <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Attribute Radar
                </span>
                <RadarChart attributes={attributes} />
              </div>
            </div>

            {/* Right: Attributes Breakdown List */}
            <div className="md:col-span-6 space-y-4">
              <div className="mettle-panel rounded-md p-6 space-y-4 bg-[var(--bg-surface)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block">
                    Personal Attributes
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Points earned by completing categorized quests. Every quest grants +1 to +3 points.
                  </p>
                </div>

                <div className="space-y-3">
                  {attributeList.map((attr) => (
                    <div key={attr.key} className="p-3.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: attr.color,
                              boxShadow: `0 0 6px ${attr.color}40`,
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-sans text-xs font-bold" style={{ color: attr.color }}>
                                {attr.label}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                ({attr.sub})
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)]">
                              {attr.desc}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-[var(--text-primary)] shrink-0 pl-2">
                          {attr.val} <span className="text-[10px] font-normal text-[var(--text-muted)]">pts</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border)]">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            backgroundColor: attr.color,
                            width: `${Math.min(100, Math.max(15, (attr.val / 50) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progression Explanation */}
              <div className="mettle-panel rounded-md p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      How Progression Works
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFormula(!showFormula)}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    {showFormula ? 'Hide formula' : 'View formula'}
                  </button>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Your attributes show how your completed tasks contribute to different areas of personal growth. Required XP increases gradually as you level up.
                </p>

                {showFormula && (
                  <div className="mt-3 p-3 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-xs text-[var(--text-primary)]">
                    <code>Required XP = round(250 × (Level − 1)^1.5)</code>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                      Base XP per tier = 250 × (N − 1)^1.5. Progress is mathematically continuous with zero float drift.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BADGES & ACHIEVEMENTS */}
      {activeSubTab === 'badges' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-md mettle-panel border transition-all ${
                badge.is_unlocked
                  ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)]'
                  : 'opacity-40 border-[var(--border)] bg-[var(--bg-surface)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-sm border ${
                    badge.is_unlocked
                      ? 'bg-[var(--accent-soft)] border-[var(--accent-border)] text-[var(--accent)]'
                      : 'bg-black/40 border-white/5 text-[var(--text-muted)]'
                  }`}
                >
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans text-sm font-semibold text-[var(--text-primary)]">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-sans">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  {badge.requirement_type.replace('_', ' ')}
                </span>
                <span
                  className={`font-semibold ${
                    badge.is_unlocked ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {badge.is_unlocked ? 'Unlocked' : `Threshold: ${badge.requirement_value}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: ACTIVITY TIMELINE */}
      {activeSubTab === 'history' && (
        <div className="mettle-panel rounded-md p-6 bg-[var(--bg-surface)]">
          {activities.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-[var(--text-muted)]">
              No activity recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block mb-4">
                Recent Activity
              </span>
              <div className="space-y-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-baseline justify-between gap-4 py-2 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div>
                        <span className="font-sans text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                          {act.event_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] ml-2">
                          {new Date(act.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {act.amount && (
                      <span className="font-display text-xs font-bold text-[var(--accent)]">
                        +{act.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

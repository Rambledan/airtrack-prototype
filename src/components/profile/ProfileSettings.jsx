import { useState } from 'react'
import PersonalisationSettings from '../personalisation/PersonalisationSettings'

// ─── Timezone data ────────────────────────────────────────────────────────────

const TIMEZONES = [
  { value: 'auto',                label: 'Auto (device)',     display: 'Auto' },
  { value: 'UTC',                 label: 'UTC',               display: 'UTC (GMT+0)' },
  { value: 'Europe/London',       label: 'London',            display: 'London (GMT)' },
  { value: 'Europe/Paris',        label: 'Paris',             display: 'Paris (CET)' },
  { value: 'Europe/Berlin',       label: 'Berlin',            display: 'Berlin (CET)' },
  { value: 'Asia/Dubai',          label: 'Dubai',             display: 'Dubai (GST)' },
  { value: 'Asia/Kolkata',        label: 'Mumbai / Delhi',    display: 'Mumbai (IST)' },
  { value: 'Asia/Singapore',      label: 'Singapore',         display: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo',          label: 'Tokyo',             display: 'Tokyo (JST)' },
  { value: 'Australia/Sydney',    label: 'Sydney',            display: 'Sydney (AEST)' },
  { value: 'Pacific/Auckland',    label: 'Auckland',          display: 'Auckland (NZST)' },
  { value: 'America/New_York',    label: 'New York',          display: 'New York (ET)' },
  { value: 'America/Chicago',     label: 'Chicago',           display: 'Chicago (CT)' },
  { value: 'America/Denver',      label: 'Denver',            display: 'Denver (MT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles',       display: 'Los Angeles (PT)' },
]

function timezoneDisplay(value) {
  const tz = TIMEZONES.find(t => t.value === value)
  return tz ? tz.display : value
}

// ─── Primitive sub-components ─────────────────────────────────────────────────

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      aria-checked={enabled}
      role="switch"
      className={`relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-brand' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-[23px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  )
}

function SectionHeader({ label, suffix }) {
  return (
    <div className="flex items-center gap-2 mb-1 px-1">
      <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
      {suffix && <span className="text-xs text-gray-400">· {suffix}</span>}
    </div>
  )
}

function SectionCard({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-1">
      {children}
    </div>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function SettingsRow({ icon, label, sublabel, toggle, onToggle, onTap, rightLabel, rightElement, border = true }) {
  return (
    <div
      className={`flex items-center gap-3 py-3.5 ${border ? 'border-b border-gray-100 last:border-b-0' : ''} ${onTap ? 'cursor-pointer active:bg-gray-50 rounded-lg -mx-1 px-1' : ''}`}
      onClick={onTap}
    >
      <span className="text-base w-7 text-center shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sublabel}</p>}
      </div>
      {rightElement}
      {toggle !== undefined && <Toggle enabled={toggle} onChange={onToggle} />}
      {rightLabel && <span className="text-sm text-gray-400 shrink-0">{rightLabel}</span>}
      {onTap && !toggle && !rightElement && <ChevronRight />}
      {onTap && rightLabel && <ChevronRight />}
    </div>
  )
}

// ─── Plan label helper ─────────────────────────────────────────────────────────

function planLabel(user) {
  if (user.state === 'registered_premium') return 'Premium'
  if (user.subscription?.plan === 'trial') return 'Trial'
  return 'Free'
}

// ─── Timezone row (inline select) ─────────────────────────────────────────────

function TimezoneRow({ value, onSave }) {
  const [open, setOpen] = useState(false)
  const current = timezoneDisplay(value || 'auto')

  const handleChange = (e) => {
    onSave(e.target.value)
    setOpen(false)
  }

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        className="flex items-center gap-3 py-3.5 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-base w-7 text-center shrink-0">🌍</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">Time Zone</p>
        </div>
        <span className="text-sm text-gray-400 shrink-0">{current}</span>
        <ChevronRight />
      </div>

      {open && (
        <div className="pb-3">
          <select
            value={value || 'auto'}
            onChange={handleChange}
            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand/30"
            size={6}
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.display}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ProfileSettings({
  user,
  isPremium,
  isGuest,
  onUpdatePermission,
  onUpdateSetting,
  onSavePersonalisation,
  onDismissPersonalisation,
  onRestorePersonalisation,
  onUpgrade,
  onSignUp,
  onManageBilling,
  onReset,
}) {
  const isRegistered = user.state === 'registered_free' || user.state === 'registered_premium'
  const settings = user.settings || {}
  const permissions = user.permissions || {}

  return (
    <div className="flex flex-col pb-20">

      {/* ── User header ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center pt-10 pb-6 px-5">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          {user.profile?.name || (isGuest ? 'Guest' : 'Profile & Settings')}
        </h2>

        {user.profile?.email ? (
          <p className="text-sm text-gray-500 mt-0.5">{user.profile.email}</p>
        ) : null}

        {/* Status badge */}
        <div className="mt-2">
          {isPremium ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              ⭐ Premium
            </span>
          ) : user.state === 'registered_free' ? (
            <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              Free Account
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Guest
            </span>
          )}
        </div>
      </div>

      {/* ── Content sections ────────────────────────────────────────── */}
      <div className="px-4 space-y-6">

        {/* ACCOUNT — registered users only */}
        {isRegistered && (
          <div>
            <SectionHeader label="Account" />
            <SectionCard>
              <SettingsRow
                icon="💳"
                label="Current Plan"
                rightLabel={planLabel(user)}
                onTap={isPremium ? onManageBilling : undefined}
              />
              {isPremium && (
                <SettingsRow
                  icon="🧾"
                  label="Manage Billing"
                  onTap={onManageBilling}
                />
              )}
            </SectionCard>

            {/* Free plan upgrade CTA */}
            {!isPremium && (
              <button
                onClick={onUpgrade}
                className="mt-3 w-full bg-brand text-white font-semibold py-3 rounded-2xl text-sm hover:bg-brand/90 active:scale-[0.98] transition-all"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        )}

        {/* HEALTH PROFILE — registered users only */}
        {isRegistered && (
          <div>
            <PersonalisationSettings
              personalization={user.personalization}
              onSave={onSavePersonalisation}
              onDismiss={onDismissPersonalisation}
              onRestore={onRestorePersonalisation}
            />
          </div>
        )}

        {/* CONNECTIONS — registered users only */}
        {isRegistered && (
          <div>
            <SectionHeader label="Connections" />
            <SectionCard>
              <SettingsRow
                icon="❤️"
                label="Apple Health"
                sublabel="Sync workouts and health metrics"
                toggle={permissions.appleHealth}
                onToggle={v => onUpdatePermission('appleHealth', v)}
              />
              <SettingsRow
                icon="🏃"
                label="Strava"
                sublabel="Import runs, rides and activities"
                toggle={permissions.strava}
                onToggle={v => onUpdatePermission('strava', v)}
              />
            </SectionCard>
          </div>
        )}

        {/* APP PREFERENCES — registered users only */}
        {isRegistered && (
          <div>
            <SectionHeader label="App Preferences" />
            <SectionCard>
              <SettingsRow
                icon="📍"
                label="Background Tracking"
                sublabel="Track exposure automatically throughout the day"
                toggle={permissions.tracking}
                onToggle={v => onUpdatePermission('tracking', v)}
              />
              <SettingsRow
                icon="📊"
                label="Daily Summary"
                sublabel="Receive a daily report of your air quality exposure"
                toggle={settings.summaryNotifications !== false}
                onToggle={v => onUpdateSetting('summaryNotifications', v)}
              />
              <SettingsRow
                icon="🌤"
                label="Forecast Alerts"
                sublabel="Get notified when poor air quality is forecast"
                toggle={settings.forecastNotifications !== false}
                onToggle={v => onUpdateSetting('forecastNotifications', v)}
              />
              <TimezoneRow
                value={settings.timezone || 'auto'}
                onSave={v => onUpdateSetting('timezone', v)}
              />
            </SectionCard>
          </div>
        )}

        {/* GUEST CTA */}
        {isGuest && (
          <div className="mt-2">
            <div className="bg-brand/5 border border-brand/20 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-gray-800 mb-1">Create a free account</p>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Save your health profile, connect apps and personalise your air quality experience.
              </p>
              <button
                onClick={onSignUp}
                className="w-full bg-brand text-white font-semibold py-3 rounded-xl text-sm hover:bg-brand/90 active:scale-[0.98] transition-all"
              >
                Create Free Account
              </button>
            </div>
          </div>
        )}

        {/* Dev reset */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onReset}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            Reset (Dev Only)
          </button>
        </div>

      </div>
    </div>
  )
}

export default function LockedOverlay({ isLocked, onTap, showLockIcon = true, children, className = '' }) {
  if (!isLocked) {
    return children
  }

  return (
    <div className={`relative ${className}`}>
      {/* The actual content with blur */}
      <div className="blur-[2px] pointer-events-none select-none">
        {children}
      </div>

      {/* Lock overlay */}
      <div
        onClick={onTap}
        className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl cursor-pointer flex items-center justify-center transition-all hover:bg-white/50"
      >
        {showLockIcon && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center shadow-lg">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 bg-white/80 px-2 py-0.5 rounded-full">
              Tap to unlock
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Smaller lock badge for inline use
export function LockBadge({ size = 'sm' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-800/80 flex items-center justify-center`}>
      <svg
        viewBox="0 0 24 24"
        className="w-2.5 h-2.5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
  )
}

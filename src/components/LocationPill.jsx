export default function LocationPill({ location = 'London, UK' }) {
  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700 active:scale-95 transition-transform">
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-brand"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {location}
      <svg
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
}

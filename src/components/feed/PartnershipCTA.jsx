export default function PartnershipCTA({ partnerName, productName, headline, ctaText }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Subtle brand gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/3 to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-4">
        {/* Partner logo placeholder */}
        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
          <span className="text-xs font-bold text-gray-400 text-center leading-tight">
            {partnerName}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-wide text-brand font-semibold">
            Partner
          </span>
          <h4 className="text-sm font-semibold text-gray-900 mt-0.5">{headline}</h4>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{productName}</p>

          <button className="mt-2 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-full hover:bg-brand-dark transition-colors">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-100/95 backdrop-blur-lg">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-center">
        <img
          src={`${import.meta.env.BASE_URL}airtrack-logo.svg`}
          alt="AirTrack"
          className="h-6"
        />
      </div>
    </header>
  )
}

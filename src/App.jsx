import Header from './components/Header'
import BottomNav from './components/BottomNav'
import LocationPill from './components/LocationPill'
import ActivityFeed from './components/feed/ActivityFeed'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
        {/* Location */}
        <div className="flex items-center justify-between mb-5">
          <LocationPill />
          <span className="text-xs text-gray-400">Updated 2 min ago</span>
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </main>

      <BottomNav />
    </div>
  )
}

export default App

import { useState, useCallback } from 'react'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { generateDaysFeed, loadMoreDays } from '../../utils/feedGenerator'
import FeedItem from './FeedItem'
import DayDivider from './DayDivider'

export default function ActivityFeed({ initialDays = 3, onViewRunningDetail, onNavigateToTab, onViewRouteOptimization, onViewTimeOptimization, userState, onLockedTap }) {
  const [feedState, setFeedState] = useState(() => generateDaysFeed(initialDays))
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(() => {
    setIsLoading(true)

    // Simulate network delay for realistic UX
    setTimeout(() => {
      const moreContent = loadMoreDays(feedState.lastDate, 2)

      setFeedState(prev => ({
        items: [...prev.items, ...moreContent.items],
        lastDate: moreContent.lastDate,
      }))
      setIsLoading(false)
    }, 400 + Math.random() * 300)
  }, [feedState.lastDate])

  const sentinelRef = useInfiniteScroll(loadMore, { isLoading })

  const renderItem = (item) => {
    if (item.type === 'day-divider') {
      return <DayDivider key={item.id} date={item.date} />
    }
    return (
      <FeedItem
        key={item.id}
        item={item}
        onViewRunningDetail={onViewRunningDetail}
        onNavigateToTab={onNavigateToTab}
        onViewRouteOptimization={onViewRouteOptimization}
        onViewTimeOptimization={onViewTimeOptimization}
        userState={userState}
        onLockedTap={onLockedTap}
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Feed items */}
      {feedState.items.map(renderItem)}

      {/* Sentinel element for infinite scroll trigger */}
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  )
}

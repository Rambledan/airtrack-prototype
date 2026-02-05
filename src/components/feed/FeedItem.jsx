import ActivitySegment from './ActivitySegment'
import BestTimeInsight from './BestTimeInsight'
import AirQualityAlert from './AirQualityAlert'
import DailySummary from './DailySummary'
import RouteOptimization from './RouteOptimization'
import NewLocationAlert from './NewLocationAlert'
import PartnershipCTA from './PartnershipCTA'
import BenchmarkCard from './BenchmarkCard'

export default function FeedItem({ item }) {
  switch (item.type) {
    case 'segment':
      return <ActivitySegment {...item} />

    case 'best-time':
      return <BestTimeInsight {...item} />

    case 'air-quality-alert':
      return <AirQualityAlert {...item} />

    case 'daily-summary':
      return <DailySummary {...item} />

    case 'route-optimization':
      return <RouteOptimization {...item} />

    case 'new-location':
      return <NewLocationAlert {...item} />

    case 'partnership':
      return <PartnershipCTA {...item} />

    case 'benchmark':
      return <BenchmarkCard {...item} />

    default:
      return null
  }
}

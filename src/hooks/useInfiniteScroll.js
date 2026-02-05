import { useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for infinite scroll using Intersection Observer
 * @param {Function} onLoadMore - Callback when sentinel becomes visible
 * @param {Object} options
 * @param {boolean} options.isLoading - Prevents multiple calls while loading
 * @param {number} [options.threshold=0.1] - Intersection threshold
 * @param {string} [options.rootMargin='200px'] - Triggers before sentinel is visible
 */
export function useInfiniteScroll(onLoadMore, { isLoading, threshold = 0.1, rootMargin = '200px' }) {
  const sentinelRef = useRef(null)

  const handleIntersect = useCallback((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && !isLoading) {
      onLoadMore()
    }
  }, [onLoadMore, isLoading])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin
    })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [handleIntersect, threshold, rootMargin])

  return sentinelRef
}

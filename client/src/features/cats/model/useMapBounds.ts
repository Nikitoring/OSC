import { useEffect, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import type { LatLngBounds } from 'leaflet'

export type MapBounds = {
  north: number
  south: number
  east: number
  west: number
}

type Props = {
  debounceMs?: number
}

/**
 * Возвращает текущие bounds карты с debounce.
 */
export function useMapBounds({ debounceMs = 400 }: Props = {}) {
  const [rawBounds, setRawBounds] = useState<MapBounds | null>(null)
  const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(null)

  useMapEvents({
    load: (e) => {
      setRawBounds(toBounds(e.target.getBounds()))
    },
    // При любом движении / зуме — обновляем сырые bounds
    moveend: (e) => {
      setRawBounds(toBounds(e.target.getBounds()))
    },
  })

  useEffect(() => {
    if (!rawBounds) return
    const t = setTimeout(() => setDebouncedBounds(rawBounds), debounceMs)
    return () => clearTimeout(t)
  }, [rawBounds, debounceMs])

  return debouncedBounds
}

/**
 * Конвертирует LatLngBounds Leaflet в наш плоский объект.
 */
function toBounds(b: LatLngBounds): MapBounds {
  return {
    north: b.getNorth(),
    south: b.getSouth(),
    east: b.getEast(),
    west: b.getWest(),
  }
}

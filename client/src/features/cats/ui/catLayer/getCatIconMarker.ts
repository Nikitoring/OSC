import L from 'leaflet'
import type { CatId } from '@/domains/domains'

const MARKER_COUNT = 5
const MARKER_SIZE = 48
const MARKER_HEIGHT = Math.round(MARKER_SIZE * (250 / 200)) // 60

const getMarkerUrl = (id: CatId) => `/markers/cat-${id % MARKER_COUNT}.png`

const iconCache = new Map<CatId, L.Icon>()

export const getCatMarkerIcon = (id: CatId): L.Icon => {
  const cached = iconCache.get(id)
  if (cached) return cached

  const icon = L.icon({
    iconUrl: getMarkerUrl(id),
    iconSize: [MARKER_SIZE, MARKER_HEIGHT],
    className: 'cat-marker',
  })

  iconCache.set(id, icon)
  return icon
}

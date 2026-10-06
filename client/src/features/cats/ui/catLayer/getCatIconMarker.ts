import L from 'leaflet'
import type { Cat, CatId } from '@/domains/domains'

const MARKER_COUNT = 5
const MARKER_SIZE = 30
const MARKER_HEIGHT = Math.round(MARKER_SIZE * (250 / 200)) // 60
type TMarkers = number

const getMarkerUrl = (type: TMarkers) => `/markers/cat-${type}.png`

const iconCache = new Map<CatId, L.Icon>()

export const getCatMarkerIcon = (cat: Cat): L.Icon => {
  const cached = iconCache.get(cat.id)
  if (cached) return cached
  let markerIcon = getMarkerUrl(0)
  if (cat.help?.length) {
    // Берем последний реквест для метки
    const helpType = cat.help[cat.help.length - 1]
    if (helpType.type === 'food') {
      markerIcon = getMarkerUrl(5)
    }
    if (helpType.type === 'medical') {
      markerIcon = getMarkerUrl(6)
    }
    if (helpType.type === 'home') {
      markerIcon = getMarkerUrl(7)
    }
  }
  const icon = L.icon({
    iconUrl: markerIcon,
    iconSize: [MARKER_SIZE, MARKER_HEIGHT],
    className: 'cat-marker',
  })

  iconCache.set(cat.id, icon)
  return icon
}

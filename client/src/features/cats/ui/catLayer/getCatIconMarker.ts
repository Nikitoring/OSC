import L from 'leaflet'
import type { Cat } from '@/domains/domains'

const MARKER_SIZE = 30
const MARKER_HEIGHT = Math.round(MARKER_SIZE * (250 / 200))

const getMarkerUrl = (type: number) => `/markers/cat-${type}.png`

export const getCatMarkerIcon = (cat: Cat, isActive = false): L.DivIcon => {
  let markerIcon = getMarkerUrl(0)
  if (cat.help?.length) {
    const helpType = cat.help[cat.help.length - 1]
    if (helpType.type === 'food') markerIcon = getMarkerUrl(5)
    if (helpType.type === 'medical') markerIcon = getMarkerUrl(6)
    if (helpType.type === 'home') markerIcon = getMarkerUrl(7)
  }

  // Используем L.divIcon вместо L.icon
  return L.divIcon({
    className: isActive ? 'cat-marker-wrapper cat-marker-active' : 'cat-marker-wrapper',
    html: `<img src="${markerIcon}" class="cat-marker-img" />`,
    iconSize: [MARKER_SIZE, MARKER_HEIGHT],
    iconAnchor: [MARKER_SIZE / 2, MARKER_HEIGHT],
  })
}

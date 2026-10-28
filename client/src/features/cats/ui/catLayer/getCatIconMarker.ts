import L from 'leaflet'
import type { Cat } from '@/domains/domains'

type HelpType = 'food' | 'medical' | 'home'
type CatMarkerType = HelpType | 'default'

const HELP_TYPES: HelpType[] = ['medical', 'food', 'home']

const MARKER_TYPES: Record<CatMarkerType, number> = {
  default: 0,
  food: 5,
  medical: 6,
  home: 7,
}

const MARKER_SIZE = 30
const MARKER_HEIGHT = Math.round(MARKER_SIZE * (250 / 200))

const getMarkerUrl = (type: number) => `/markers/cat-${type}.png`

function getLatestHelpRequest(cat: Cat, type: HelpType) {
  return cat.help
    .filter((request) => request.type === type)
    .reduce<(typeof cat.help)[number] | null>((latest, request) => {
      if (!latest) return request

      return new Date(request.createdAt).getTime() > new Date(latest.createdAt).getTime()
        ? request
        : latest
    }, null)
}

export function getActiveHelpTypes(cat: Cat): HelpType[] {
  return HELP_TYPES.filter((type) => getLatestHelpRequest(cat, type)?.state === 'needed')
}

export function getCatMarkerType(cat: Cat): CatMarkerType {
  const activeTypes = getActiveHelpTypes(cat)

  // При нескольких активных запросах выбираем один маркер
  // по приоритету: медицинская помощь, еда, дом.
  return HELP_TYPES.find((type) => activeTypes.includes(type)) ?? 'default'
}

export const getCatMarkerIcon = (cat: Cat, isActive = false): L.DivIcon => {
  const markerType = getCatMarkerType(cat)
  const markerUrl = getMarkerUrl(MARKER_TYPES[markerType])

  return L.divIcon({
    className: isActive ? 'cat-marker-wrapper cat-marker-active' : 'cat-marker-wrapper',
    html: `<img src="${markerUrl}" class="cat-marker-img" />`,
    iconSize: [MARKER_SIZE, MARKER_HEIGHT],
    iconAnchor: [MARKER_SIZE / 2, MARKER_HEIGHT],
  })
}

import { Marker, Circle } from 'react-leaflet'
import { useMapBounds } from '../../model/useMapBounds'
import { useCats } from '../../queries/cats.queries'
import { getCatMarkerIcon, getActiveHelpTypes } from './getCatIconMarker'
import type { Cat, CatId } from '@/domains/domains'
import type { MapBounds } from '../../model/useMapBounds'
import './cat.layer.css'

type HelpType = 'food' | 'medical' | 'home'

type Props = {
  selectedCatId: CatId | null
  onSelect: (cat: Cat) => void
  bounds?: MapBounds
  interactionDisabled?: boolean
  filters: {
    search_text?: string
    gender?: string
    help_type?: HelpType[]
  }
}

const CAT_RADIUS_METERS = 100

export function CatsLayer({
  onSelect,
  bounds: externalBounds,
  selectedCatId,
  filters = {},
  interactionDisabled = false,
}: Props) {
  const mapBounds = useMapBounds()
  const bounds = externalBounds ?? mapBounds

  // Передаём серверу фильтры, которые он поддерживает.
  const { help_type, ...queryFilters } = filters

  const queryParams = {
    bounds,
    ...queryFilters,
  }

  const { data } = useCats(queryParams)

  // Если тип помощи выбран, оставляем котов,
  // у которых есть актуальный запрос подходящего типа.
  const cats = (data?.cats ?? []).filter((cat) => {
    if (!help_type?.length) return true

    const activeHelpTypes = getActiveHelpTypes(cat)

    return help_type.some((type) => activeHelpTypes.includes(type))
  })

  return (
    <>
      {cats.map((cat) => (
        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
          interactive={!interactionDisabled}
          icon={getCatMarkerIcon(cat, cat.id === selectedCatId)}
          eventHandlers={{
            click: () => onSelect(cat),
          }}
        />
      ))}

      {selectedCatId &&
        cats
          .filter((cat) => cat.id === selectedCatId)
          .map((cat) => (
            <Circle
              key={`circle-${cat.id}`}
              center={[cat.latitude, cat.longitude]}
              radius={CAT_RADIUS_METERS}
              pathOptions={{
                color: '#F97316',
                fillColor: '#F97316',
                fillOpacity: 0.2,
                weight: 2,
                opacity: 0.6,
              }}
            />
          ))}
    </>
  )
}

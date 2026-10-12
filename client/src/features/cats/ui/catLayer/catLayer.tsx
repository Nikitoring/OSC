import { Marker, Circle } from 'react-leaflet'
import { useMapBounds } from '../../model/useMapBounds'
import { useCats } from '../../queries/cats.queries'
import { getCatMarkerIcon } from './getCatIconMarker'
import type { CatId } from '@/domains/domains'
import type { MapBounds } from '../../model/useMapBounds'
import './cat.layer.css'

type Props = {
  selectedCatId: CatId | null
  onSelect: (id: CatId) => void
  bounds?: MapBounds
  filters: { search_text?: string; gender?: string }
}

const CAT_RADIUS_METERS = 100

export function CatsLayer({
  onSelect,
  bounds: externalBounds,
  selectedCatId,
  filters = {},
}: Props) {
  const mapBounds = useMapBounds()
  const bounds = externalBounds ?? mapBounds
  const queryParams = {
    bounds: bounds,
    ...filters,
  }
  const { data } = useCats(queryParams)

  return (
    <>
      {data?.cats.map((cat) => (
        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
          icon={getCatMarkerIcon(cat, cat.id === selectedCatId)}
          eventHandlers={{ click: () => onSelect(cat) }}
        ></Marker>
      ))}
      {selectedCatId &&
        data?.cats
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

import { Marker } from 'react-leaflet'
import { useMapBounds } from '../../model/useMapBounds'
import { useCats } from '../../queries/cats.queries'
import { getCatMarkerIcon } from './getCatIconMarker'
import type { CatId } from '@/domains/domains'
import type { MapBounds } from '../../model/useMapBounds'

type Props = {
  onSelect: (id: CatId) => void
  bounds?: MapBounds
}

export function CatsLayer({ onSelect, bounds: externalBounds }: Props) {
  const mapBounds = useMapBounds()
  const bounds = externalBounds ?? mapBounds
  const { data } = useCats(bounds ? { bounds } : {})

  return (
    <>
      {data?.cats.map((cat) => (
        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
          icon={getCatMarkerIcon(cat.id)}
          eventHandlers={{ click: () => onSelect(cat) }}
        ></Marker>
      ))}
    </>
  )
}

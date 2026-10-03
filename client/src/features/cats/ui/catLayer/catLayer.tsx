import { Marker, Circle } from 'react-leaflet'
import { useMapBounds } from '../../model/useMapBounds'
import { useCats } from '../../queries/cats.queries'
import { getCatMarkerIcon } from './getCatIconMarker'
import type { Cat, CatId } from '@/domains/domains'
import type { MapBounds } from '../../model/useMapBounds'
import './cat.layer.css'
import { useState } from 'react'

type Props = {
  onSelect: (id: CatId) => void
  bounds?: MapBounds
}

const CAT_RADIUS_METERS = 100

export function CatsLayer({ onSelect, bounds: externalBounds }: Props) {
  const mapBounds = useMapBounds()
  const bounds = externalBounds ?? mapBounds
  const { data } = useCats(bounds ? { bounds } : {})
  const [activeCatId, setActiveCat] = useState<CatId | null>(null)

  const onSelectCat = (cat: Cat) => {
    onSelect(cat)
    setActiveCat(cat.id)
  }

  return (
    <>
      {data?.cats.map((cat) => (
        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
          icon={getCatMarkerIcon(cat.id)}
          eventHandlers={{ click: () => onSelectCat(cat) }}
        ></Marker>
      ))}
      {activeCatId &&
        data?.cats
          .filter((cat) => cat.id === activeCatId)
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

import { useEffect, useState } from 'react'
import { MapContainer as OSCMap, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './map.css'

const MapController = ({
  onLocationFound,
}: {
  onLocationFound: (latlng: [number, number]) => void
}) => {
  const map = useMap()

  useMapEvents({
    locationfound: (event) => {
      if (event.latlng) {
        onLocationFound([event.latlng.lat, event.latlng.lng])
      }
    },
    locationerror: () => {
      console.warn(
        'Геолокация недоступна или запрещена пользователем. Используем центр по умолчанию.',
      )
    },
  })

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 })
  }, [map])

  return null
}

const MapPage = () => {
  const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors'

  const DEFAULT_CENTER: [number, number] = [55.751244, 37.618423]
  const DEFAULT_ZOOM = 13
  const MIN_ZOOM = 3
  const MAX_ZOOM = 19

  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)

  const handleLocationFound = (latlng: [number, number]) => {
    setCenter(latlng)
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <OSCMap
        center={center}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoomControl={false}
        style={{ height: '100%', width: '100%', borderRadius: '0.8rem' }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <MapController onLocationFound={handleLocationFound} />
      </OSCMap>
    </div>
  )
}

export default MapPage

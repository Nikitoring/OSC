import type { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map.css'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION = '© OpenStreetMap contributors'

type Props = {
  /** Центр карты. По умолчанию — Москва. */
  center?: LatLngExpression
  zoom?: number
  interactive?: boolean
  height?: string | number
  children?: ReactNode
  overlays?: ReactNode
}

export function MapWidget({
  center = [55.751244, 37.618423],
  zoom = 13,
  interactive = true,
  height = '100%',
  children,
  overlays,
}: Props) {
  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={3}
        maxZoom={19}
        zoomControl={false}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '0.8rem',
        }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {children}
      </MapContainer>
      {overlays}
    </div>
  )
}

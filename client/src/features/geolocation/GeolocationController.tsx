import { useEffect, useState } from 'react'
import { useMap, useMapEvents, CircleMarker, Tooltip } from 'react-leaflet'

/**
 * Компонент, который при монтировании запрашивает геолокацию
 * и центрирует карту на позиции пользователя.
 *
 * Используется ТОЛЬКО внутри <MapWidget>, т.к. требует контекста react-leaflet.
 */
export function GeolocationController() {
  const map = useMap()
  const [userPosition, setUserPosition] = useState<L.LatLngExpression | null>(null)

  useMapEvents({
    locationfound: (e) => {
      setUserPosition(e.latlng)
      map.setView(e.latlng, 16)
    },
    locationerror: () => {
      console.warn('Геолокация недоступна. Используем центр по умолчанию.')
    },
  })

  useEffect(() => {
    map.locate({ setView: false, maxZoom: 16 })
  }, [map])

  return (
    userPosition && (
      <CircleMarker
        center={userPosition}
        radius={10}
        pathOptions={{
          color: 'var(--color-orange)',
          fillColor: 'var(--color-orange)',
          fillOpacity: 0.5,
        }}
      >
        <Tooltip>Вы здесь</Tooltip>
      </CircleMarker>
    )
  )
}

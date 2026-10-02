import { useEffect } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'

/**
 * Компонент, который при монтировании запрашивает геолокацию
 * и центрирует карту на позиции пользователя.
 *
 * Используется ТОЛЬКО внутри <MapWidget>, т.к. требует контекста react-leaflet.
 */
export function GeolocationController() {
  const map = useMap()

  useMapEvents({
    locationfound: (e) => {
      map.setView(e.latlng, 16)
    },
    locationerror: () => {
      console.warn('Геолокация недоступна. Используем центр по умолчанию.')
    },
  })

  useEffect(() => {
    map.locate({ setView: false, maxZoom: 16 })
  }, [map])

  return null
}

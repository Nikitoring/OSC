import { useState } from 'react'
import L from 'leaflet'
import { Circle, Marker, useMapEvents } from 'react-leaflet'

import { Card } from '@/components/shared/ui/card/Card'
import OscButton from '@/components/shared/ui/buttons/Button'
import { useDisableMapEvents } from '@/utils/useDisableMapEvents'

export interface MapCat {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface CatCoordinates {
  latitude: number
  longitude: number
}

interface AddCatMapModeProps {
  active: boolean
  radius?: number
  onConfirm: (location: CatCoordinates) => void
  onCancel: () => void
  onOpenCat: (catId: string) => void
}

const selectedLocationIcon = L.divIcon({
  className: 'add-cat-location-marker',
  html: '<span aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function LocationPicker({
  active,
  onSelect,
}: {
  active: boolean
  onSelect: (location: CatCoordinates) => void
}) {
  useMapEvents({
    click(event) {
      if (!active) return
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    },
  })

  return null
}

export function AddCatMapMode({
  active,
  radius = 100,
  onConfirm,
  onCancel,
  onOpenCat,
}: AddCatMapModeProps) {
  const [location, setLocation] = useState<CatCoordinates | null>(null)

  // При выключении режима сбрасываем временную точку.
  // При повторном открытии пользователь начинает заново.
  const [previousActive, setPreviousActive] = useState(active)

  if (active !== previousActive) {
    setPreviousActive(active)
    if (active) {
      setLocation(null)
    }
  }

  function handleConfirm() {
    if (!location) return
    onConfirm(location)
  }
  const panelRef = useDisableMapEvents<HTMLDivElement>()
  return (
    <>
      <LocationPicker active={active} onSelect={setLocation} />
      {active && location && (
        <>
          <Circle
            center={[location.latitude, location.longitude]}
            radius={radius}
            pathOptions={{
              color: '#2878f0',
              fillColor: '#2878f0',
              fillOpacity: 0.16,
              weight: 2,
            }}
            interactive={false}
          />

          <Marker
            position={[location.latitude, location.longitude]}
            icon={selectedLocationIcon}
            interactive={false}
          />
        </>
      )}
      {active && (
        <div
          ref={panelRef}
          className="add-cat-panel-wrapper"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
        >
          <Card className="add-cat-panel">
            <div className="add-cat-panel__heading">
              <span className="add-cat-panel__icon"></span>

              <div>
                <h2>Добавить кота</h2>
                <p>{location ? 'Местоположение выбрано' : 'Нажмите на свободное место карты'}</p>
              </div>
            </div>

            {location && (
              <div className="add-cat-panel__coordinates">
                <span>Широта</span>
                <strong>{location.latitude.toFixed(5)}</strong>

                <span>Долгота</span>
                <strong>{location.longitude.toFixed(5)}</strong>

                <span>Радиус</span>
                <strong>≈ {radius} м</strong>
              </div>
            )}

            <div className="add-cat-panel__actions">
              <OscButton variant="secondary" size="small" onClick={onCancel}>
                Отмена
              </OscButton>

              <OscButton
                variant="primary"
                size="small"
                disabled={!location}
                onClick={handleConfirm}
              >
                Выбрать место
              </OscButton>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

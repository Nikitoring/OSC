import { useState } from 'react'
import L from 'leaflet'
import { Circle, Marker, useMapEvents } from 'react-leaflet'
import OpenStreetCatLogo from '@/shared/assests/logo/main_logo.svg?react'
import { Card } from '@/components/shared/ui/card/Card'
import OscButton from '@/components/shared/ui/buttons/Button'
import { useDisableMapEvents } from '@/utils/useDisableMapEvents'
import { geocoders } from 'leaflet-control-geocoder'
import type { CatCoordinates } from './domains'

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

const geocoder = new geocoders.Nominatim()

function LocationPicker({
  active,
  onSelect,
}: {
  active: boolean
  onSelect: (location: CatCoordinates) => void
}) {
  useMapEvents({
    async click(event) {
      if (!active) return
      const latlng = L.latLng(event.latlng.lat, event.latlng.lng)
      const res = await geocoder.reverse(latlng, 1e8)

      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        address: res[0].properties.display_name,
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
              <span className="add-cat-panel__icon">
                <OpenStreetCatLogo />
              </span>

              <div>
                <h2>Добавить кота</h2>
                <h4 className="osc-my-0 osc-text-gray-500">Шаг 1</h4>
                <p>{location ? 'Местоположение выбрано' : 'Нажмите на свободное место карты'}</p>
              </div>
            </div>

            {location && (
              <div className="add-cat-panel__coordinates">
                <span>Адрес</span>
                <span>{location.address}</span>
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

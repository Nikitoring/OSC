import { MapWidget } from '@/components/shared/mapWidget/MapWidget'
import type { Cat } from '@/domains/domains'
import { CatsLayer } from '@/features/cats/ui/catLayer/catLayer'
import { GeolocationController } from '@/features/geolocation/geolocationController'
import { useState } from 'react'
import styles from './mapPage.module.css'
import { MapFiltersPanel } from './MapFiltersPanel'
import { MapLegend } from './MapLegend'
import CatCard from '@/features/cats/ui/catCard/CatCard'

const MapPage = () => {
  const [selectedCat, setSelected] = useState<Cat | null>(null)
  return (
    <div className={styles['map-container']}>
      <MapWidget
        overlays={
          <>
            <MapFiltersPanel />
            <MapLegend />
            {selectedCat && (
              <div className={styles['map-selected-cat']}>
                <CatCard cat={selectedCat} closable onClose={setSelected} />
              </div>
            )}
          </>
        }
      >
        <GeolocationController />
        <CatsLayer onSelect={setSelected} />
      </MapWidget>
    </div>
  )
}

export default MapPage

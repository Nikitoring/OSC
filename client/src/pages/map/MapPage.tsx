import { MapWidget } from '@/components/shared/mapWidget/MapWidget'
import type { Cat } from '@/domains/domains'
import { CatsLayer } from '@/features/cats/ui/catLayer/catLayer'
import { GeolocationController } from '@/features/geolocation/GeolocationController'
import { useState } from 'react'
import styles from './mapPage.module.css'
import { MapFiltersPanel } from './MapFiltersPanel'
import { MapLegend } from './MapLegend'
import CatCard from '@/features/cats/ui/catCard/CatCard'

type CatFilters = {
  search_text?: string
  gender?: string
}

const MapPage = () => {
  const [selectedCat, setSelected] = useState<Cat | null>(null)
  const [filters, setFilters] = useState<CatFilters>({})

  return (
    <div className={styles['map-container']}>
      <MapWidget
        overlays={
          <>
            <MapFiltersPanel filters={filters} onFiltersChange={setFilters} />
            <MapLegend />
            {selectedCat && (
              <div className={styles['map-selected-cat']}>
                <CatCard cat={selectedCat} closable onClose={() => setSelected(null)} />
              </div>
            )}
          </>
        }
      >
        <GeolocationController />
        <CatsLayer onSelect={setSelected} selectedCatId={selectedCat?.id} filters={filters} />
      </MapWidget>
    </div>
  )
}

export default MapPage

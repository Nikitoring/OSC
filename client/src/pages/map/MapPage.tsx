import { MapWidget } from '@/components/shared/mapWidget/MapWidget'
import type { Cat } from '@/domains/domains'
import { CatsLayer } from '@/features/cats/ui/catLayer/CatLayer'
import { GeolocationController } from '@/features/geolocation/GeolocationController'
import { useState, useCallback, useEffect } from 'react'
import styles from './mapPage.module.css'
import { MapFiltersPanel } from './MapFiltersPanel'
import { MapLegend } from './MapLegend'
import CatCard from '@/features/cats/ui/catCard/CatCard'
import { useSearchParams } from 'react-router-dom'
import { AddCatMapMode, type CatCoordinates } from '@/features/cats/ui/addCat/AddCatMapMode'
import OscButton from '@/components/shared/ui/buttons/Button'

type CatFilters = {
  search_text?: string
  gender?: string
  help_type?: ('food' | 'medical' | 'home')[]
}

const MapPage = () => {
  const [selectedCat, setSelected] = useState<Cat | null>(null)
  const [filters, setFilters] = useState<CatFilters>({})
  const [searchParams, setSearchParams] = useSearchParams()

  const isAddingCat = searchParams.get('mode') === 'add-cat'

  const enterAddCatMode = useCallback(() => {
    setSelected(null)

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('mode', 'add-cat')
      return next
    })
  }, [setSearchParams])

  const exitAddCatMode = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('mode')
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  useEffect(() => {
    if (isAddingCat) {
      setSelected(null)
    }
  }, [isAddingCat])

  function handleConfirm(location: CatCoordinates) {
    // TODO: вызвать createCat mutation.
    // Выходить из режима только после успешного сохранения.
    console.log('Selected location:', location)
  }

  return (
    <div className={styles['map-container']}>
      <MapWidget
        overlays={
          <>
            {!isAddingCat && (
              <>
                <MapFiltersPanel filters={filters} onFiltersChange={setFilters} />
                <MapLegend />

                {selectedCat && (
                  <div className={styles['map-selected-cat']}>
                    <CatCard cat={selectedCat} closable onClose={() => setSelected(null)} />
                  </div>
                )}
              </>
            )}
          </>
        }
      >
        <GeolocationController />

        <CatsLayer
          onSelect={setSelected}
          selectedCatId={selectedCat?.id}
          filters={filters}
          interactionDisabled={isAddingCat}
        />

        {isAddingCat && (
          <AddCatMapMode active radius={100} onConfirm={handleConfirm} onCancel={exitAddCatMode} />
        )}
      </MapWidget>
    </div>
  )
}

export default MapPage

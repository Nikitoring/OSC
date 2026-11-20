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
import { useMap } from 'react-leaflet'
import AddCartSidebar from '@/features/cats/ui/addCat/AddCatSidebar'
import { useCat } from '@/features/cats/queries/cats.queries'

type CatFilters = {
  search_text?: string
  gender?: string
  help_type?: ('food' | 'medical' | 'home')[]
}

function FocusMapOnCat({ cat }: { cat: Cat | undefined }) {
  const map = useMap()

  useEffect(() => {
    if (!cat) return
    map.flyTo([cat.latitude, cat.longitude], Math.max(map.getZoom(), 16), {
      duration: 0.75,
    })
  }, [cat?.id, cat?.latitude, cat?.longitude, map])

  return null
}

const MapPage = () => {
  const [selectedCat, setSelected] = useState<Cat | null>(null)
  const [filters, setFilters] = useState<CatFilters>({})
  const [searchParams, setSearchParams] = useSearchParams()

  const sidebarMode = searchParams.get('mode')
  const isAddingCat = sidebarMode === 'add-cat' || sidebarMode === 'edit-cat'
  const rawEditingCatId = searchParams.get('catId')
  const editingCatId =
    rawEditingCatId && /^\d+$/.test(rawEditingCatId) ? Number(rawEditingCatId) : null
  const { data: editingCat } = useCat(sidebarMode === 'edit-cat' ? editingCatId : null)

  const enterAddCatMode = useCallback(() => {
    setSelected(null)

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('mode', 'add-cat')
      return next
    })
  }, [setSearchParams])

  useEffect(() => {
    if (isAddingCat) {
      setSelected(null)
    }
  }, [isAddingCat])

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
        {sidebarMode !== 'edit-cat' && <GeolocationController />}
        <FocusMapOnCat cat={sidebarMode === 'edit-cat' ? editingCat : undefined} />

        <CatsLayer
          onSelect={setSelected}
          selectedCatId={sidebarMode === 'edit-cat' ? editingCatId : (selectedCat?.id ?? null)}
          filters={filters}
          interactionDisabled={isAddingCat}
        />

        {isAddingCat && <AddCartSidebar />}
      </MapWidget>
    </div>
  )
}

export default MapPage

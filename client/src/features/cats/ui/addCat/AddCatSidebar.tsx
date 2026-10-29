import { useCallback, useState } from 'react'
import { AddCatMapMode, type CatCoordinates } from './AddCatMapMode'
import { useSearchParams } from 'react-router-dom'
import './addCatMapMode.css'
import { useDisableMapEvents } from '@/utils/useDisableMapEvents'
import L from 'leaflet'

const AddCartSidebar = () => {
  const [catLocation, setCatLocation] = useState<CatCoordinates | null>(null)
  const [_searchParams, setSearchParams] = useSearchParams()

  const sidebarRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return

    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)
  }, [])

  function handleConfirm(location: CatCoordinates) {
    // TODO: вызвать createCat mutation.
    // Выходить из режима только после успешного сохранения.
    console.log('Selected location:', location)
    setCatLocation(location)
  }

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

  if (!catLocation)
    return <AddCatMapMode active radius={100} onConfirm={handleConfirm} onCancel={exitAddCatMode} />
  return (
    <div ref={sidebarRef} className="add-cat-sidebar">
      <div>
        {catLocation.latitude} — {catLocation.longitude}
      </div>

      {/* Следующий шаг формы добавления кота */}
    </div>
  )
}

export default AddCartSidebar

import { useCallback, useState } from 'react'
import { AddCatMapMode } from './AddCatMapMode'
import { useSearchParams } from 'react-router-dom'
import './addCatMapMode.css'
import L from 'leaflet'
import type { CatCoordinates } from './domains'
import { Card } from '@/components/shared/ui/card/Card'
import { MoveLeft } from 'lucide-react'
import OscButton from '@/components/shared/ui/buttons/Button'

const AddCartSidebar = () => {
  const [catLocation, setCatLocation] = useState<CatCoordinates | null>(null)
  const [_searchParams, setSearchParams] = useSearchParams()

  const sidebarRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return

    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)
  }, [])

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
    return (
      <AddCatMapMode active radius={100} onConfirm={setCatLocation} onCancel={exitAddCatMode} />
    )
  return (
    <div ref={sidebarRef} className="add-cat-sidebar">
      <div className="osc-flex osc-gap-4 osc-items-center">
        <OscButton variant="transparent" size="xs" onClick={() => setCatLocation(null)}>
          <MoveLeft />
        </OscButton>
        <h2 className="osc-mb-0">Добавить кота</h2>
      </div>

      <h4 className=" osc-text-gray-500">Шаг 2. Информация о коте</h4>
      <Card>
        <h3 className="osc-mb-1">Местоположение выбрано</h3>
        <p>
          {catLocation.address} <br />
          Приблизительная область встречи · 100 м
        </p>
        <span>Можно вернуться и изменить точку на карте.</span>
      </Card>
    </div>
  )
}

export default AddCartSidebar

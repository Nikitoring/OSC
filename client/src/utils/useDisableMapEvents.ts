import { useEffect, useRef } from 'react'
import L from 'leaflet'

export function useDisableMapEvents<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)

    return () => {
      L.DomEvent.off(element)
    }
  }, [])

  return ref
}

export interface MapCat {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface CatCoordinates {
  latitude: number
  longitude: number
  address?: string | undefined
}

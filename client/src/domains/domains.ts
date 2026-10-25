export type CatId = number
export type UserId = number
export type PhotoId = number

export type CatGender = 'male' | 'female' | 'unknown'

export type HelpType = 'food' | 'medical' | 'home'

export type HelpState = 'needed' | 'resolved'

export type CreateCatDto = {
  name?: string
  gender?: CatGender
  description?: string
  latitude: number
  longitude: number
}

export type CatResponseDto = {
  id: number
  name: string
  gender: CatGender
  description: string | null
  location: {
    latitude: number
    longitude: number
    radiusMeters: number
  }
  createdAt: string
  createdBy: number
}

export type Photo = {
  id: PhotoId
  url: string
}

export type CatLocation = {
  latitude: number
  longitude: number
  radiusMeters: number
}

export type HelpRequest = {
  catId: CatId
  type: HelpType
  state: HelpState
  createdAt: string
  createdBy: UserId
}

export type Cat = {
  id: CatId
  name: string
  gender: CatGender
  description: string | null
  photos?: Photo[]
  latitude: number
  longitude: number
  help?: HelpRequest[]
  created_at: string
  created_by: UserId
}

export type User = {
  iserId: UserId
  username: string
  createdAt: string
}

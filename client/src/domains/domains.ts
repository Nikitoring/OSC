export type CatId = number
export type UserId = number
export type PhotoId = number

export type CatGender = 'male' | 'female' | 'unknown'

export type HelpType = 'food' | 'medical' | 'home'

export type HelpState = 'needed' | 'resolved'

export type CreateCatDto = {
  name?: string
  gender?: CatGender
  latitude: number
  longitude: number
}

export type CatResponseDto = {
  id: number
  name: string
  gender: CatGender
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
  photos?: Photo[]
  latitude: number
  longitude: number
  help?: HelpRequest[]
  createdAt: string
  createdBy: UserId
}

export type User = {
  id: UserId
  username: string
  createdAt: string
}

export type CatId = number
export type UserId = number
export type PhotoId = number

export type CatGender = 'male' | 'female' | 'unknown'

export type HelpType = 'food' | 'medical' | 'home'

export type HelpState = 'needed' | 'resolved'

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
  location?: CatLocation
  help?: HelpRequest[]
  createdAt: string
  createdBy: UserId
}

export type User = {
  id: UserId
  username: string
  createdAt: string
}

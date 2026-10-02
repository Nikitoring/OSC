export type ApiErrorData = {
  code: string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, data: ApiErrorData) {
    super(data.message)

    this.name = 'ApiError'
    this.status = status
    this.code = data.code
  }
}

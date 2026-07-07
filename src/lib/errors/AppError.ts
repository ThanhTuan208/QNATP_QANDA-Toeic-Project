export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'AppError'
  }

  static notFound(entity: string) {
    return new AppError(404, `${entity} not found`, 'NOT_FOUND')
  }

  static validation(message: string) {
    return new AppError(400, message, 'VALIDATION_ERROR')
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(401, message, 'UNAUTHORIZED')
  }
}

/**
 * @enum {DomainErrorMessagesEnum} DomainErrorMessagesEnum - Definition of messages displayed in errors
 *
 * @arg {string} AccessDeniedError - Access denied message error
 * @arg {string} EmailInUseError - Email in use message error
 * @arg {string} InvalidCredentialsError - Invalid credentials message error
 * @arg {string} UnexpectedError - Unexpected message error
 * @arg {string} NotFoundError - Not Found error
 * @arg {string} NoContent - NoContent error
 *
 */
export enum DomainErrorMessagesEnum {
  AccessDeniedError = "Access denied!",
  EmailInUseError = "This email is already in use",
  InvalidCredentialsError = "Invalid credentials",
  BadRequest = "Bad Request The server could not understand the request due to invalid syntax.",
  UnexpectedError = "Something went wrong. Try again later.",
  NotFoundError = "404 Not Found",
  NoContent = "NoContent",
  UnauthorizedError = "Sorry, you are not authorized to access this resource.",
  ServerError = "Sorry, Server Error.",
}

/**
 * @enum {DomainErrorNamesEnum} DomainErrorNamesEnum - Definition of messages names used in errors
 *
 * @arg {string} AccessDeniedError - Access denied name error
 * @arg {string} EmailInUseError - Email in use name error
 * @arg {string} InvalidCredentialsError - Invalid credentials name error
 * @arg {string} UnexpectedError - Unexpected name error
 * @arg {string} NotFoundError - Not Found error
 * @arg {string} NoContent - Not Found error
 */
export enum DomainErrorNamesEnum {
  AccessDeniedError = "AccessDeniedError",
  EmailInUseError = "EmailInUseError",
  UnauthorizedError = "UnauthorizedError",
  InvalidCredentialsError = "InvalidCredentialsError",
  BadRequest = "BadRequest",
  UnexpectedError = "UnexpectedError",
  ServerError = "ServerError",
  NotFoundError = "NotFound",
  NoContent = "NoContent",
}

import { DomainErrorMessagesEnum, DomainErrorNamesEnum } from '../enums'

export class ServerError extends Error {
  constructor(message?: string) {
    super(message || DomainErrorMessagesEnum.ServerError)
    this.name = DomainErrorNamesEnum.ServerError
  }
}

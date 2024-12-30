import { DomainErrorMessagesEnum, DomainErrorNamesEnum } from "../enums";

export class UnauthorizedError extends Error {
  constructor() {
    super(DomainErrorMessagesEnum.UnauthorizedError);
    this.name = DomainErrorNamesEnum.UnauthorizedError;
  }
}

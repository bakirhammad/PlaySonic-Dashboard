import { DomainErrorMessagesEnum, DomainErrorNamesEnum } from "../enums";

export class NotFoundError extends Error {
  constructor() {
    super(DomainErrorMessagesEnum.NotFoundError);
    this.name = DomainErrorNamesEnum.NotFoundError;
  }
}

import { DomainErrorMessagesEnum, DomainErrorNamesEnum } from "../enums";

export class BadRequestError extends Error {
  constructor() {
    super(DomainErrorMessagesEnum.BadRequest);
    this.name = DomainErrorNamesEnum.BadRequest;
  }
}

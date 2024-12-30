import { DomainErrorMessagesEnum, DomainErrorNamesEnum } from "../enums";

export class NoContent extends Error {
  constructor() {
    super(DomainErrorMessagesEnum.NoContent);
    this.name = DomainErrorNamesEnum.NoContent;
  }
}

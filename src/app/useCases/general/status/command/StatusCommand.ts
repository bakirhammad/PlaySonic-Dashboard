/* eslint-disable @typescript-eslint/no-explicit-any */
import { IStatusBody, IStatusCommand } from "@domain/entities/general/statusUpdate/Status";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { ICommand } from "@domain/primitives/commands/ICommand";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class StatusCommand implements IStatusCommand, ICommand {
  constructor(private readonly httpPostClient: IHttpClient) {}


  async updateStatus(url: string, body: any): Promise<IStatusBody[]> {
    const httpResponse = await this.httpPostClient.putRequest({ url, body });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.data.value;
      case HttpStatusCode.coustomError:
        throw new Error(httpResponse.data?.message);
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      case HttpStatusCode.badRequest:
        throw new BadRequestError();
      case HttpStatusCode.serverError:
        throw new ServerError();
      default:
        throw new UnexpectedError();
    }
  }

}
export const StatusCommandInstance = new StatusCommand(makeAxiosHttpClient());

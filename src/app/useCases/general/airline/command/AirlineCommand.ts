/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAirlineCommand, IAirlineBody } from "@domain/entities";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { ICommand } from "@domain/primitives/commands/ICommand";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class AirlineCommand implements IAirlineCommand, ICommand {
  constructor(private readonly httpPostClient: IHttpClient) {}

  async createAirline(url: string, body: any): Promise<IAirlineBody[]> {
    const httpResponse = await this.httpPostClient.postRequest({ url, body });
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
  async updateAirline(url: string, body: any): Promise<IAirlineBody[]> {
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
  async deleteAirline(url: string, id: number): Promise<IAirlineBody> {
    const newUrl = `${url}Id=${id}`;

    const httpResponse = await this.httpPostClient.deleteRequest({
      url: newUrl,
    });
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
  async multipleDeleteAirline(
    url: string,
    ids: number[]
  ): Promise<IAirlineBody> {
    const httpResponse = await this.httpPostClient.deleteRequest({
      url,
      body: ids,
    });
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
export const AirlineCommandInstance = new AirlineCommand(makeAxiosHttpClient());

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ISightSeeingTourRateCommand,
  ISightSeeingTourRateData,
} from "@domain/entities";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { ICommand } from "@domain/primitives/commands/ICommand";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class SightSeeingTourRateCommand
  implements ISightSeeingTourRateCommand, ICommand {
  constructor(private readonly httpPostClient: IHttpClient) { }

  async createSightSeeingTourRate(
    url: any,
    body: any
  ): Promise<ISightSeeingTourRateData> {
    const httpResponse = await this.httpPostClient.postRequest({
      url,
      body,
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
  async updateSightSeeingTourRate(
    url: any,
    body: any
  ): Promise<ISightSeeingTourRateData> {
    const httpResponse = await this.httpPostClient.putRequest({
      url,
      body,
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
  async deleteSightSeeingTourRate(
    url: string,
    id: number
  ): Promise<ISightSeeingTourRateData> {
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

  async multipleDeleteSightSeeingTourRate(
    url: string,
    ids: number[]
  ): Promise<ISightSeeingTourRateData> {
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

export const SightSeeingTourRateCommandInstance =
  new SightSeeingTourRateCommand(makeAxiosHttpClient());

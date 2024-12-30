/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICountryBody,
  ICountryCommand,
} from "@domain/entities/general/country/Country";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { ICommand } from "@domain/primitives/commands/ICommand";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class CountryCommand implements ICountryCommand, ICommand {
  constructor(private readonly httpPostClient: IHttpClient) { }

  async createCountry(url: string, body: any): Promise<ICountryBody[]> {
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
  async updateCountry(url: string, body: any): Promise<ICountryBody[]> {
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
  async deleteCountry(url: string, id: number): Promise<ICountryBody> {
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
  async multipleDeleteCountry(
    url: string,
    ids: number[]
  ): Promise<ICountryBody> {
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
  async deleteImage(
    url: string,
    id: number,
    isDeleteFlag: boolean,
    isDeleteImage: boolean
  ): Promise<ICountryBody> {
    const httpResponse = await this.httpPostClient.deleteRequest({
      url,
      body: {
        id,
        isDeleteFlag,
        isDeleteImage,
      },
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
export const CountryCommandInstance = new CountryCommand(makeAxiosHttpClient());

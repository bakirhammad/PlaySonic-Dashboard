/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData } from "@domain/entities";
import { IUserClassCommand } from "@domain/entities/authentication";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { ICommand } from "@domain/primitives/commands/ICommand";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class UserClassCommand implements IUserClassCommand, ICommand {
  constructor(private readonly httpPostClient: IHttpClient) {}

  async createUserClass(url: string, body: any): Promise<UserData> {
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

  async updateUserClass(url: string, body: any): Promise<UserData> {
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
  async UpdateUserPassword(
    url: string,
    body: any
  ): Promise<Pick<UserData, "id" | "password">> {
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
}

export const UserCommandInstance = new UserClassCommand(makeAxiosHttpClient());

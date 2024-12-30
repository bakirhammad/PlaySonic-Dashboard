import {
  AuthModel,
  IAuthentication,
  IManageUsersResponse,
  IUserData,
  LoginBody,
  Model,
} from "@domain/entities";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { UnauthorizedError } from "@domain/errors/UnauthorizedError";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class Authentication implements IAuthentication {
  constructor(private readonly httpPostClient: IHttpClient) {}

  async login(url: string, body: LoginBody): Promise<AuthModel> {
    const httpResponse = await this.httpPostClient.postRequest({ url, body });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.data.value;
      case HttpStatusCode.coustomError:
        throw new Error(httpResponse.data?.message);
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.forbidden:
        throw new UnauthorizedError();
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      case HttpStatusCode.serverError:
        throw new ServerError();
      default:
        throw new UnexpectedError();
    }
  }

  async CheckUserName(url: string): Promise<AuthModel> {
    const httpResponse = await this.httpPostClient.getRequest({ url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.data.value;
      case HttpStatusCode.coustomError:
        throw new Error(httpResponse.data?.message);
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.forbidden:
        throw new UnauthorizedError();
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      case HttpStatusCode.serverError:
        throw new ServerError();
      default:
        throw new UnexpectedError();
    }
  }
  async CheckOldPassword(url: string): Promise<{ user: IUserData }> {
    const httpResponse = await this.httpPostClient.getRequest({ url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.data.value;
      case HttpStatusCode.coustomError:
        throw new Error(httpResponse.data?.message);
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.forbidden:
        throw new UnauthorizedError();
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      case HttpStatusCode.serverError:
        throw new ServerError();
      default:
        throw new UnexpectedError();
    }
  }
  async getUserByToken(url: string): Promise<Model> {
    const httpResponse = await this.httpPostClient.postRequest({
      url,
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.data.value;
      case HttpStatusCode.coustomError:
        throw new Error(httpResponse.data?.message);
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.forbidden:
        throw new UnauthorizedError();
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      case HttpStatusCode.serverError:
        throw new ServerError();
      default:
        throw new UnexpectedError();
    }
  }
  async getUsersList(url: string): Promise<IManageUsersResponse> {
    const httpResponse = await this.httpPostClient.getRequest({ url });
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

export const UserClassQueryInstance = new Authentication(makeAxiosHttpClient());

import { IImageBannerData, IImageBannerQueryById } from "@domain/entities/general/ImageBanner/ImageBanner";
import { IHttpClient } from "@domain/entities/protocols/http";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { IQuery } from "@domain/primitives/query/IQuery";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class ImageBannerQueryById
  implements IImageBannerQueryById, IQuery {
  constructor(private readonly httpPostClient: IHttpClient) { }

  async getImageBannerById(
    url: string,
    id: number
  ): Promise<IImageBannerData> {
    const newUrl = `${url}Id=${id}`;
    const httpResponse = await this.httpPostClient.getRequest({
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
}
export const ImageBannerQueryByIdInstance =
  new ImageBannerQueryById(makeAxiosHttpClient());

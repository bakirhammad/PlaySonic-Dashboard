/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILanguageCommand {
  createLanguage(url: string, body: any): Promise<ILanguage[]>;
  // updateLanguage(url: string, body: ILanguage): Promise<ILanguage[]>;
}
export interface ILanguageQuery {
  getLanguageList(url: string): Promise<ILanguage[]>;
}

export interface ILanguage {
  id: number;
  name: string;
  encoding: string;
  direction: string;
  culture: string;
  prefix: string;
}

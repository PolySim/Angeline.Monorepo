export interface Information {
  id: string;
  name: string;
  content: string;
  lang: Lang;
}

export interface HomepageSettings {
  id: string;
  visible: boolean;
  title: string;
  content: string;
}

export enum Lang {
  FR = "fr",
  EN = "us",
}

export interface Category {
  id: string;
  name: string;
  article?: string;
  ordered: number;
  disabled: boolean;
}

export interface Image {
  id: string;
  name: string;
  path: string;
  description?: string;
  category: string;
  ordered: number;
}

export interface CreateInformationDto {
  name: string;
  content: string;
  lang: string;
}

export interface UpdateInformationDto {
  name?: string;
  content?: string;
  lang?: string;
}

export type UpdateHomepageSettingsDto = Partial<
  Pick<HomepageSettings, "visible" | "title" | "content">
>;

export interface CreateCategoryDto {
  name: string;
  article?: string;
  ordered: number;
  disabled?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  article?: string;
  ordered?: number;
  disabled?: boolean;
}

export interface CreateImageDto {
  name: string;
  path: string;
  description?: string;
  category: string;
  ordered: number;
}

export interface UpdateImageDto {
  name?: string;
  path?: string;
  description?: string;
  category?: string;
  ordered?: number;
}

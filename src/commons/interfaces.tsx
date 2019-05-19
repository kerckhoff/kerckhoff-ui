export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface IPackageSetResponse {
  count: number;
  next: URL;
  previous: URL;
  results: IPackageSet[];
}

export interface IPackageSet {
  id: string;
  slug: string;
  metadata: IPackageMeta;
}

export type IPackageSetInit = Pick<IPackageSet, "slug">;

export interface IPackageResponse {
  count: number;
  next: URL;
  previous: URL;
  results: IPackage[];
}

export interface IPackageVersionResponse {
  results: IPackageVersion[];
}

export interface IPackage {
  id: string;
  slug: string;
  metadata: IPackageMeta;
  package_set: string;
  cached: ICachedPackageItem[];
  last_fetched_date?: string;
}

export interface IPackageMeta {
  google_drive?: {
    folder_id: string;
    folder_url: string;
  };
}

export interface IPackageVersion {
  id: string;
  id_num: number;
  title: string;
  version_description: string;
  created_at: string;
}

export interface ICachedPackageItem {
  altLink: string;
  last_modified_by: string;
  mimeType: string;
  title: string;
  thumbnail_link: string;
  content_plain: ICachedPackageItemTextContent;
}

export interface ICachedPackageItemTextContent {
  data: any;
  html: string;
  raw: string;
}

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface IResponseUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
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

export interface IPackageWithVersion extends IPackage {
  version_data: IPackageVersionWithVersionData;
}

export interface IPackageVersion {
  id: string;
  id_num: number;
  title: string;
  version_description: string;
  created_at: string;
  created_by: IResponseUser;
}

export interface ICreateVersionPayload {
  title: string;
  version_description: string;
  included_items: string[];
}

export interface IPackageVersionWithVersionData extends IPackageVersion {
  packageitem_set: IPackageItem[];
}

export interface IPackageItem {
  data: IPackageItemData;
  mime_type: string;
  id: string;
  filename: string;
  datatype: string;
}

export interface ICachedPackageItem {
  altLink: string;
  last_modified_by: string;
  format?: string;
  mimeType: string;
  title: string;
  thumbnail_link: string;
  content_plain: ICachedPackageItemTextContent;
  last_modified_date: string;
}

export interface IPackageItemData {
  altLink: string;
  last_modified_by: string;
  last_modified_date: string;
  format?: string;
  mimeType: string;
  title: string;
  thumbnail_link: string;
  content_plain: ICachedPackageItemTextContent;
  src_large: string;
}

export type JSONText = any;

export interface ICachedPackageItemTextContent {
  data: JSONText;
  html: string;
  raw: string;
}

import { AxiosInstance } from "axios";
import {
  IPackageSet,
  IPackageSetInit,
  IPackageResponse,
  IPackage,
  IPackageSetResponse,
  IPackageVersionResponse,
  IPackageVersionWithVersionData,
  IPackageWithVersion,
  ICreateVersionPayload
} from "../commons/interfaces";

type PackageOrderingField =
  | "slug"
  | "last_fetched_date"
  | "created_at"
  | "updated_at";

export class ModelOperations {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async updatePackageSet(ps: IPackageSet, patch: Partial<IPackageSet>) {
    return this.axios.patch<IPackageSet>(`/package-sets/${ps.slug}/`, patch);
  }

  async fetchPackagesForPackageSet(ps: IPackageSet) {
    return this.axios.post<IPackageResponse>(
      `/package-sets/${ps.slug}/sync_gdrive/`
    );
  }

  async getPackages(
    ps: IPackageSet,
    ordering: PackageOrderingField = "updated_at",
    descending: boolean = true
  ) {
    return this.axios.get<IPackageResponse>(
      `/package-sets/${ps.slug}/packages/`,
      { params: { ordering: `${descending ? "-" : ""}${ordering}` } }
    );
  }

  async getPackageDetails(ps: IPackageSet, packageSlug: string) {
    return this.axios.get<IPackage>(
      `/package-sets/${ps.slug}/packages/${packageSlug}/`
    );
  }

  async getPackageDetailsWithVersion(
    ps: IPackageSet,
    packageSlug: string,
    version: number
  ) {
    return this.axios.get<IPackageWithVersion>(
      `/package-sets/${ps.slug}/packages/${packageSlug}/?version=${version}`
    );
  }

  async getPackageVersions(ps: IPackageSet, packageSlug: string) {
    return this.axios.get<IPackageVersionResponse>(
      `/package-sets/${ps.slug}/packages/${packageSlug}/versions/`
    );
  }

  async updatePackageCache(ps: IPackageSet, p: IPackage) {
    return this.axios.post<IPackage>(
      `/package-sets/${ps.slug}/packages/${p.slug}/preview/`
    );
  }

  async createPackageVersion(
    ps: IPackageSet,
    p: IPackage,
    payload: ICreateVersionPayload
  ) {
    return this.axios.post<IPackage>(
      `/package-sets/${ps.slug}/packages/${p.slug}/snapshot/`,
      payload
    );
  }

  async createPackageSet(ps: IPackageSetInit) {
    return this.axios.post<IPackage>(`/package-sets/`, ps);
  }

  async getPackageSets(ordering: PackageOrderingField = "slug") {
    return this.axios.get<IPackageSetResponse>(`/package-sets/`, {
      params: { ordering }
    });
  }
}

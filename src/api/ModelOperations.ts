import { AxiosInstance } from "axios";
import {
  IPackageSet,
  IPackageSetInit,
  IPackageResponse,
  IPackage,
  IPackageSetResponse
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

  async updatePackageCache(ps: IPackageSet, p: IPackage) {
    return this.axios.post<IPackage>(
      `/package-sets/${ps.slug}/packages/${p.slug}/preview/`
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

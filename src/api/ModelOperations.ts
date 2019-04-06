import { AxiosInstance } from "axios";
import {
  IPackageSet,
  IPackageSetInit,
  IPackageResponse,
  IPackage
} from "../commons/interfaces";

export class ModelOperations {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async updatePackageSet(ps: IPackageSet, patch: Partial<IPackageSet>) {
    return this.axios.patch<IPackageSet>(`/package-sets/${ps.slug}/`, patch);
  }

  async getPackages(ps: IPackageSet) {
    return this.axios.get<IPackageResponse>(
      `/package-sets/${ps.slug}/packages/`
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
}

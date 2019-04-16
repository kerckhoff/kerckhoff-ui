import React from "react";
import { IUser, IPackageSetResponse, IPackageSet } from "../commons/interfaces";
import {
  OAUTH_LOCAL_STORAGE_KEY,
  KERCKHOFF_URL,
  API_BASE
} from "../commons/constants";
import Axios, { AxiosInstance } from "axios";
import { message } from "antd";
import { ModelOperations } from "../api/ModelOperations";
import { notifyError, notifyOk } from "../commons/notify";
import { deferred } from "../util";
import { history } from "../commons/history";

export const GlobalState = (React.createContext(
  {}
) as unknown) as React.Context<IGlobalState>;

export interface IGlobalState {
  user?: Partial<IUser>;
  authenticatedAxios?: AxiosInstance;
  packageSets?: IPackageSet[];
  selectedPackageSet?: IPackageSet;
  modelOps?: ModelOperations;
  updateUser: (info: Partial<IUser>) => Promise<void>;
  setPackageSet: (id: string) => Promise<IPackageSet | undefined>;
  syncPackageSets: () => Promise<void>;
  refreshStateFromLocalStorage: () => Promise<void>;
}

const objToReadable = (o: { [key: string]: any }) => {
  const segs: string[] = [];
  for (const k in o) {
    segs.push(
      `${k}: ${
        typeof o[k] === "string"
          ? o[k]
          : Array.isArray(o[k])
          ? o[k].join(", ")
          : JSON.stringify(o[k])
      }`
    );
  }
  return segs.join("\n");
};

export class GlobalStateWrapper extends React.Component<{}, IGlobalState> {
  constructor(props: any) {
    super(props);
    this.state = {
      updateUser: this.updateUser,
      syncPackageSets: this.syncPackageSets,
      setPackageSet: this.setPackageSet,
      refreshStateFromLocalStorage: this.refreshStateFromLocalStorage
    };
  }

  componentDidMount() {
    this.refreshStateFromLocalStorage();
  }

  createAuthenticatedAxios = (token: string) => {
    const axios = Axios.create({
      baseURL: API_BASE,
      headers: { Authorization: "Token " + token }
    });

    axios.interceptors.response.use(undefined, error => {
      console.error(error);
      if (error.response) {
        if (error.response.status == 403 && this.state.user) {
          // If we get a 403, and the user is set, the token might have become invalid
          this.logoutUser().then(() => {
            history.push("/");
            notifyError(`You have been signed out. Please log in again.`);
          });
        } else {
          notifyError(
            `${error.response.status} ERROR: ${objToReadable(
              error.response.data
            )}`
          );
        }
      } else if (error.request) {
        notifyError(`Request error: ${error.request}`);
      } else {
        notifyError(`Error: ${error.message}`);
      }
    });

    return axios;
  };

  setPackageSet = async (slug: string) => {
    if (!this.state.packageSets) {
      await this.syncPackageSets();
    }

    const resultPackageSet = this.state.packageSets!.find(v => v.slug === slug);
    if (!resultPackageSet) {
      notifyError(`Package Set ${slug} is not found!`);
    } else {
      if (this.state.selectedPackageSet!.slug !== slug) {
        this.setState({
          selectedPackageSet: resultPackageSet
        });
      }
      return resultPackageSet;
    }
  };

  syncPackageSets = async () => {
    const ops = this.state.modelOps;
    if (ops) {
      const results = await ops.getPackageSets();
      console.log("Found packagesets: ", results.data.results);
      const newPackageSet = this.state.selectedPackageSet
        ? results.data.results.find(
            ps => ps.slug === this.state.selectedPackageSet!.slug
          )
        : results.data.results[0]
        ? results.data.results[0]
        : undefined;
      const p = deferred();
      this.setState(
        {
          packageSets: results.data.results,
          selectedPackageSet: newPackageSet
        },
        () => p.resolve()
      );
      return p.promise;
    } else {
      console.error("Cannot sync packagesets when not logged in!");
    }
  };

  updateUser = async (info: Partial<IUser>) => {
    const newUser = {
      ...(this.state.user || {}),
      ...info
    };
    const axios = this.createAuthenticatedAxios(newUser.token!);
    localStorage.setItem(OAUTH_LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    const p = deferred();
    this.setState(
      {
        user: newUser,
        authenticatedAxios: axios,
        modelOps: new ModelOperations(axios)
      },
      () => {
        p.resolve();
      }
    );
    return p.promise;
  };

  logoutUser = async () => {
    localStorage.removeItem(OAUTH_LOCAL_STORAGE_KEY);
    const p = deferred();
    this.setState(
      {
        user: undefined,
        authenticatedAxios: undefined,
        packageSets: undefined,
        selectedPackageSet: undefined,
        modelOps: undefined
      },
      () => p.resolve()
    );
    return p.promise;
  };

  refreshStateFromLocalStorage: () => Promise<void> = async () => {
    const loginJSON = localStorage.getItem(OAUTH_LOCAL_STORAGE_KEY);
    if (loginJSON) {
      try {
        const loginData = JSON.parse(loginJSON) as IUser;
        console.log("User data LOADED:", loginData);
        const axios = this.createAuthenticatedAxios(loginData.token!);
        this.setState(
          {
            user: loginData,
            authenticatedAxios: axios,
            modelOps: new ModelOperations(axios)
          },
          async () => {
            try {
              await this.syncPackageSets();
            } catch (err) {
              console.error(err);
            }
            // this.syncPackageSets().catch(err => {
            //   console.error(err);
            // });
          }
        );
      } catch {}
    } else {
      console.log("User is not logged in.");
    }
  };

  render() {
    return (
      <GlobalState.Provider value={this.state}>
        {this.props.children}
      </GlobalState.Provider>
    );
  }
}

import React from "react";
import { IUser } from "../commons/interfaces";
import { OAUTH_LOCAL_STORAGE_KEY } from "../commons/constants";

export const GlobalState = React.createContext({}) as unknown as React.Context<IGlobalState>;

export interface IGlobalState {
  user?: Partial<IUser>;
  updateUser: (info: Partial<IUser>) => void;
}

export class GlobalStateWrapper extends React.Component<{}, IGlobalState> {
  constructor(props: any) {
    super(props);
    this.state = {
      updateUser: this.updateUser,
    };
  }

  updateUser = (info: Partial<IUser>) => {
    const newUser = {
      ...(this.state.user || {}),
      ...info,
    };
    localStorage.setItem(OAUTH_LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    this.setState({
      user: newUser,
    });
  }

  componentDidMount() {
    const loginJSON = localStorage.getItem(OAUTH_LOCAL_STORAGE_KEY);
    if (loginJSON) {
      try {
        const loginData = JSON.parse(loginJSON) as IUser;
        console.log("User data LOADED:", loginData);
        this.setState({
          user: loginData,
        });
      } catch {} 
    }
  }

  render() {
    return (
      <GlobalState.Provider value={this.state}>
        {this.props.children}
      </GlobalState.Provider>
    );
  }
}

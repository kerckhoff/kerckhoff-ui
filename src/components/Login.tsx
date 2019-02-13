import * as React from "react";
import { OAUTH_URL } from "../commons/constants";
import axios from "axios";
import { GlobalState } from "../providers";

interface OAuthLoginProps {
  render: (isLoggedIn?: boolean) => React.ReactNode;
}

export class OAuthLogin extends React.Component<OAuthLoginProps> {
  handleLogin = async (_e: any) => {
    const resJSON = (await axios.get(OAUTH_URL)).data;
    let redirectURL = resJSON["redirect_url"] as string;
    window.open(redirectURL, "_self");
  };

  render() {
    return (
      <GlobalState.Consumer>
        {({ user }) => (
          <div onClick={this.handleLogin}>
            {this.props.render(!!user)}
          </div>
        )}
      </GlobalState.Consumer>
    );
  }
}

import * as React from "react";
import { OAUTH_URL } from "../commons/constants";
import axios from "axios";

export class OAuthLogin extends React.Component {
  handleLogin = async (_e: any) => {
    const resJSON = (await axios.get(OAUTH_URL)).data;
    let redirectURL = resJSON["redirect_url"] as string;
    window.open(redirectURL, "_self");
  };

  render() {
    return <div onClick={this.handleLogin}>Login</div>;
  }
}

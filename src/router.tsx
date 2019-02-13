import React from "react";
import { Router, Route, Link, Switch } from "react-router-dom";
import { LoginCallbackPage } from "./pages/LoginCallbackPage";
import { history } from "./commons/history";

const Index = () => <h2>Home</h2>;

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/auth/google/callback" component={LoginCallbackPage} />
    </Switch>
  </Router>
);

export default AppRouter;

import React from "react";
import { Router, Route, Link, Switch } from "react-router-dom";
import { LoginCallbackPage } from "./pages/LoginCallbackPage";
import { history } from "./commons/history";
import Homepage from "./pages/HomePage";
import { PackageDetailPage } from "./pages/PackageDetail";

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Homepage} />
      <Route path="/:packageSetId/:packageId" component={PackageDetailPage} />
      <Route path="/auth/google/callback" component={LoginCallbackPage} />
    </Switch>
  </Router>
);

export default AppRouter;

import React from "react";
import { Router, Route, Link, Switch } from "react-router-dom";
import { LoginCallbackPage } from "./pages/LoginCallbackPage";
import Homepage from "./pages/HomePage";
import { PackageDetailPage } from "./pages/PackageDetail";
import { IntegrationRedirectPage } from "./pages/IntegrationRedirectPage";

const AppRouter = () => (
  <Switch>
    <Route path="/" exact component={Homepage} />
    <Route path="/:packageSetId" exact component={Homepage} />
    <Route path="/auth/google/callback" component={LoginCallbackPage} />
    <Route
      path="/integrations/auth/redirect"
      exact
      component={IntegrationRedirectPage}
    />
    <Route path="/:packageSetId/:packageId" component={PackageDetailPage} />
  </Switch>
);

export default AppRouter;

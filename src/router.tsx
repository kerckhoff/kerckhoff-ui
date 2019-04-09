import React from "react";
import { Router, Route, Link, Switch } from "react-router-dom";
import { LoginCallbackPage } from "./pages/LoginCallbackPage";
import Homepage from "./pages/HomePage";
import { PackageDetailPage } from "./pages/PackageDetail";

const AppRouter = () => (
  <Switch>
    <Route path="/" exact component={Homepage} />
    <Route path="/:packageSetId" exact component={Homepage} />
    <Route path="/auth/google/callback" component={LoginCallbackPage} />
    <Route path="/:packageSetId/:packageId" component={PackageDetailPage} />
  </Switch>
);

export default AppRouter;

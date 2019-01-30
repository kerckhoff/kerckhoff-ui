import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Index = () => <h2>Home</h2>;

const AppRouter = () => (
  <Router>
    <Route path="/" exact component={Index} />
  </Router>
);

export default AppRouter;

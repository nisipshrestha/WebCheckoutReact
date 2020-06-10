import React from "react";
import WebCheckout from "./containers/WebCheckout";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <WebCheckout />
        </Route>
      </Switch>
    </Router>
  );
}

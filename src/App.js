import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import WebCheckout from "./containers/WebCheckout";
import RedirectPage from "./RedirectPage";

const TopNav = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        Navbar
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/redirectPage">
          Redirect Page
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

const Content = () => (
  <Router>
    <TopNav />
    <Switch>
      <Route exact path="/" component={WebCheckout} />
      <Route path="/redirectPage" component={RedirectPage} />
    </Switch>
  </Router>
);
export default function App() {
  return (
    <>
      <Content />
    </>
  );
}

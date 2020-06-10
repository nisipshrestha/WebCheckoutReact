import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";

import WebCheckout from "./containers/WebCheckout";

const TopNav = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>
      </Nav>
    </Navbar>
  );
};

const Content = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <WebCheckout />
      </Route>
    </Switch>
  </Router>
);
export default function App() {
  return (
    <>
      <TopNav />
      <Content />
    </>
  );
}

import React from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

const nameMapper = {
  txnId: "Transaction Id",
  referenceId: "Reference Id",
  merchantName: "Merchant Name",
  bankCode: "Bank Code",
  amount: "Amount",
  charge: "Charge",
  discount: "Discount"
};

export default ({ data, title }) => (
  <Container>
    <div className="text-center">
      <h1 className="text-success display-4">{title.toUpperCase()}</h1>
    </div>
    <ListGroup variant="flush">
      {Object.keys(data).map(
        x =>
          nameMapper[x] && (
            <ListGroup.Item key={x}>
              <Row>
                <Col>
                  <b>{nameMapper[x]}</b>
                </Col>
                <Col>{data[x]}</Col>
              </Row>
            </ListGroup.Item>
          )
      )}
    </ListGroup>
  </Container>
);

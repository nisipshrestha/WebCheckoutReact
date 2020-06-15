import React from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

const nameMapper = {
  merchantCode: "Merchant Code",
  bankCode: "Bank Code",
  orderNumber: "Merchant Code",
  tokenId: "Token Id",
  amount: "Amount",
  charge: "Charge",
  discount: "Discount",
  txnId: "Transaction Id"
};
export default ({ data }) => {
  return (
    <Container>
      <div className="text-center">
        <h1 className="display-4">Redirected View</h1>
      </div>

      <ListGroup variant="flush">
        {Object.keys(data).map(
          x =>
            data[x] && (
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
};

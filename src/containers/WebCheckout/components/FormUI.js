import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default ({
  handleSubmit,
  handleChange,
  data,
  setData,
  setSubmitType
}) => {
  return (
    <Container>
      <div className="text-center">
        <h1 className="display-4">Web Checkout</h1>
      </div>

      <Container>
        <Row>
          <Col md="12">
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>API Key</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="apiKey"
                    value={data.apiKey || ""}
                    placeholder="Enter API Key"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="amount"
                    value={data.amount || ""}
                    placeholder="Enter Amount"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="currency"
                    value={data.currency || ""}
                    placeholder="Enter Currency"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Bank Code</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="bankCode"
                    value={data.bankCode || ""}
                    placeholder="Enter Bank Code"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Return Url</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="returnUrl"
                    value={data.returnUrl || ""}
                    placeholder="Enter Return Url"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Callback Url</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="callbackUrl"
                    value={data.callbackUrl || ""}
                    placeholder="Enter Callback Url"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Group>
                <Form.Label>Reference Id</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChange}
                  name="referenceId"
                  value={data.referenceId || ""}
                  placeholder="Enter Reference Id"
                />
              </Form.Group>

              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Date Of Request</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={handleChange}
                    name="dateOfRequest"
                    value={data.dateOfRequest || ""}
                    placeholder="Enter Date Of Request"
                  />
                </Form.Group>
              </Row>

              <Form.Group>
                <Button
                  variant="danger"
                  type="button"
                  name="reset"
                  onClick={() => setData({})}
                >
                  Reset
                </Button>{" "}
                <Button
                  variant="primary"
                  type="submit"
                  name="submit"
                  onClick={({ target: { name } }) => setSubmitType(name)}
                >
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

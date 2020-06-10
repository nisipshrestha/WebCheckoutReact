import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CryptoJS, { HmacSHA512 } from "crypto-js";

export default function WebCheckout() {
  const [submitType, setSubmitType] = useState("");
  const [data, setData] = useState({ apiKey: "asdfasdf " });

  const generateDvh = () => {
    const request = {
      apiKey: "3568f8c7-3f33-49dc-bbc9-9362c130f7c8",
      amount: 100.5,
      currency: "NPR",
      bankCode: "GIBL",
      referenceId: "22579ebe-51be-43ea-4444-01754bd0fb78",
      dvh:
        "3ae3a9c66f8c67fe4b8d5e7703ec3381726515784beacb96690f0850764ee4652e86dbba75938af1f7dd61057e29a37a7f493e82c6bafe947bffaec6b7f07ebf",
      dateOfRequest: "1985879879877890",
      returnUrl: "www.return.com",
      callbackUrl: "www.callback.com"
    };
    const secretKey = "3568f8c73f3349dcbbc99362c130f7c8";
    const { dvh, metaData, context, ...validationObject } = request;

    try {
      let dvhString = JSON.stringify(validationObject).toString("base64");
      const hmac = HmacSHA512(dvhString, secretKey);
      const hash = CryptoJS.enc.Hex.stringify(hmac);
      setData(state => ({ ...state, dvh: hash }));
    } catch (error) {
      throw error;
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setData(state => ({ ...state, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (submitType === "submit") {
      const formData = new FormData(e.target);
      console.log([...formData.entries()]);
    } else if (submitType === "generateDvhBtn") generateDvh();
  };

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
                    placeholder="API Key"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="amount"
                    value={data.amount || ""}
                    placeholder="Amount"
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
                    placeholder="Currency"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Bank Code</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="bankCode"
                    value={data.bankCode || ""}
                    placeholder="Bank Code"
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
                    placeholder="Return Url"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Callback Url</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="callbackUrl"
                    value={data.callbackUrl || ""}
                    placeholder="Callback Url"
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
                  placeholder="Reference Id"
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
                    placeholder="Date Of Request"
                  />
                </Form.Group>
              </Row>

              <Form.Group>
                <Form.Label>Dvh</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  onChange={handleChange}
                  name="dvh"
                  value={data.dvh || ""}
                  placeholder="Dvh"
                />
              </Form.Group>

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
                  variant="success"
                  type="submit"
                  name="generateDvhBtn"
                  onClick={({ target: { name } }) => setSubmitType(name)}
                >
                  Generate Dvh
                </Button>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                name="submit"
                onClick={({ target: { name } }) => setSubmitType(name)}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

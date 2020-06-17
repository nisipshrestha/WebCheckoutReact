import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  CardGroup,
  ListGroup
} from "react-bootstrap";

export default ({
  handleSubmit,
  handleChange,
  handleGenerateDvh,
  handleMerchantSelection,
  merchantList,
  data,
  setData,
  setSubmitType
}) => {
  return (
    <Container>
      <div className="text-center">
        <h1 className="display-4">Web Checkout</h1>
      </div>

      <CardGroup>
        <Card>
          <Card.Body>
            <h2>Merchant Selection</h2>
            <ListGroup as="ul">
              {merchantList.map((x, i) => (
                <ListGroup.Item
                  key={`${i + 1}`}
                  as="li"
                  active={x.active}
                  onClick={e => handleMerchantSelection({ ...x })}
                  style={{ cursor: "pointer" }}
                >
                  {x.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  API Key
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="apiKey"
                    value={data.apiKey || ""}
                    placeholder="Enter API Key"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Date Of Request
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="date"
                    onChange={handleChange}
                    name="dateOfRequest"
                    value={data.dateOfRequest || ""}
                    placeholder="Enter Date Of Request"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Merchant
                </Form.Label>
                <Col sm md lg>
                  <Form.Control readOnly defaultValue="Web Checkout Merchant" />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Amount
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="amount"
                    value={data.amount || ""}
                    placeholder="Enter Amount"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Currency
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="currency"
                    value={data.currency || ""}
                    placeholder="Enter Currency"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Bank Code
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="bankCode"
                    value={data.bankCode || ""}
                    placeholder="Enter Bank Code"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Return Url
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="returnUrl"
                    value={data.returnUrl || ""}
                    placeholder="Enter Return Url"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Callback Url
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="callbackUrl"
                    value={data.callbackUrl || ""}
                    placeholder="Enter Callback Url"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Cancel Url
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="cancelUrl"
                    value={data.cancelUrl || ""}
                    placeholder="Enter Cancel Url"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Reference Id
                </Form.Label>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="referenceId"
                    value={data.referenceId || ""}
                    placeholder="Enter Reference Id"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col sm="4">
                  <Button
                    variant="success"
                    type="button"
                    name="generateDVH"
                    onClick={handleGenerateDvh}
                  >
                    Generate DVH
                  </Button>
                </Col>
                <Col sm md lg>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows="4"
                    onChange={handleChange}
                    name="dvh"
                    value={data.dvh || ""}
                    placeholder="Enter DVH"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} />
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
                  disabled={!data.dvh}
                  variant="primary"
                  type="submit"
                  name="submit"
                  onClick={({ target: { name } }) => setSubmitType(name)}
                >
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </CardGroup>
    </Container>
  );
};

import React, { useState } from 'react';
import { Form, Row, Col, Container, Form } from 'react-bootstrap';

const EnvironmentSelector = ({ data, handleChange }) => {
  return (
    <Container>
      <h4>Select Environment:</h4>
      <Form.Group>
        <Row>
          <Col>
            <Form.Check
              type="radio"
              label="Development"
              value="Development"
              checked={data === 'Development'}
              onChange={handleChange}
              name="environment"
            />
            <Form.Check
              type="radio"
              label="Testing"
              value="Testing"
              checked={data === 'Testing'}
              onChange={handleChange}
              name="environment"
            />
            <Form.Check
              type="radio"
              label="Demo / Staging"
              value="Demo"
              checked={data === 'Demo'}
              onChange={handleChange}
              name="environment"
            />
            <Form.Check
              type="radio"
              label="POC"
              value="Poc"
              checked={data === 'Poc'}
              onChange={handleChange}
              name="environment"
            />
            <Form.Check
              type="radio"
              label="VAPT"
              value="Vapt"
              checked={data === 'Vapt'}
              onChange={handleChange}
              name="environment"
            />
          </Col>
        </Row>
      </Form.Group>
    </Container>
  );
};

export default EnvironmentSelector;

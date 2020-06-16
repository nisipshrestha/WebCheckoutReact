import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import {
  computeDvh,
  removeKeys,
  getParameterByName,
  dataExtractor,
  apiSettings as settings
} from "../commonHelper";
import FailurePage from "./FailurePage";
import SuccessPage from "./components/SuccessForm";

const API_BASE = "https://bfi-merchant.bitsbeat.com/api/v1/";

const RedirectPage = () => {
  const [toDisplay, setToDisplay] = useState(null);

  useEffect(() => {
    const extractedData = getParameterByName("data");

    if (extractedData) {
      const transactionDetail = dataExtractor(extractedData);
      const { dvh, ...rest } = transactionDetail;

      (() => {
        const { apiKey, referenceId, token, totalAmount } = rest;
        verifyTransaction({
          apiKey,
          referenceId,
          token,
          totalAmount: parseFloat(totalAmount),
          dvh: computeDvh(rest)
        });
      })();
      displaySetter(rest);
    }
  }, []);

  /* -------------------- FN verifyTransaction -------------------- */
  const verifyTransaction = async param => {
    settings.body = JSON.stringify(param);
    try {
      const fetchResponse = await fetch(
        `${API_BASE}merchant/web-checkout/verify-transaction`,
        settings
      );
      const { response, data: successData } = await fetchResponse.json();

      if (response.status === 200) {
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displaySetter = data => {
    switch (data.txnStatus) {
      // switch ("01") {
      case "00":
        setToDisplay(<SuccessPage data={data} title={"Success"} />);
        break;
      case "01":
      case "03":
        setToDisplay(<FailurePage title={"Transaction Failed"} />);
        break;
      case "02":
        break;
      default:
        break;
    }
  };
  return (
    <Container>
      {toDisplay || <h1 className="display-4">NOTHING TO DISPLAY</h1>}
    </Container>
  );
};

export default RedirectPage;

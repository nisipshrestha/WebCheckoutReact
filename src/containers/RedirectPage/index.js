import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import FailurePage from "./FailurePage";
import SuccessPage from "./components/RedirectForm";

const getParameterByName = (name, url) => {
  if (!name) return "";
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const RedirectPage = () => {
  const [toDisplay, setToDisplay] = useState(null);

  useEffect(() => {
    const extractedData = getParameterByName("data");
    if (extractedData) {
      const transactionDetail = JSON.parse(
        Buffer.from(extractedData, "base64").toString("ascii")
      );
      const { dvh, token, txnStatus, txnMessage, ...rest } = transactionDetail;
      displaySetter(`${txnStatus}`, rest);
    }
  }, []);

  const displaySetter = (txnStatus, data, title) => {
    switch (txnStatus) {
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

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

  const [isVerified, setIsVerified] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState({});
  const [verifiedData, setVerifiedData] = useState({});
  useEffect(() => {
    const urlData = getParameterByName("data");
    if (urlData) setTransactionDetail(dataExtractor(urlData));
  }, []);

  const handleVerify = () => {
    const { dvh, ...rest } = transactionDetail;
    const { apiKey, referenceId, token, totalAmount } = rest;

    (async param => {
      settings.body = JSON.stringify(param);
      try {
        const fetchResponse = await fetch(
          `${API_BASE}merchant/web-checkout/verify-transaction`,
          settings
        );
        const { response, data: successData } = await fetchResponse.json();
        if (response.status === 200) {
          console.log(successData);
          setIsVerified(true);
          setVerifiedData(successData);
        } else {
          alert(response.message);
        }
      } catch (e) {
        console.error(e);
      }
    })({
      apiKey,
      referenceId,
      token,
      totalAmount: parseFloat(totalAmount),
      dvh: computeDvh(rest)
    });
  };

  const { txnStatus } = transactionDetail || {};
  return (
    <Container>
      {(!txnStatus && <h1 className="display-4">NOTHING TO DISPLAY</h1>) ||
        (txnStatus === "00" &&
          ((
            <SuccessPage
              isVerified={isVerified}
              data={transactionDetail}
              title={"Success"}
              handleVerify={handleVerify}
              verifiedData={verifiedData}
            />
          ) ||
            txnStatus === "01" ||
            (txnStatus === "03" && (
              <FailurePage title={"Transaction Failed"} />
            ))))}
    </Container>
  );
};

export default RedirectPage;

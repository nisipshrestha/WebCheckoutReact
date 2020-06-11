import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import FormUI from "./components/FormUI";
import { withRouter } from "react-router-dom";

function WebCheckout(props) {
  /* ==================== React Hooks ==================== */
  const [submitType, setSubmitType] = useState("");
  const [successType, setSuccessType] = useState("");
  const [responseDvh, setResponseDvh] = useState("");
  const [data, setData] = useState({
    apiKey: "3568f8c7-3f33-49dc-bbc9-9362c130f7c8",
    amount: 100.5,
    currency: "NPR",
    bankCode: "GIBL",
    referenceId: `pr${Date.now()}`,
    // referenceId: ``,
    dvh: "",
    dateOfRequest: new Date().toLocaleDateString("fr-CA"),
    returnUrl: `${window.location.href}redirectPage`,
    callbackUrl: "www.callback.com",
    cancelUrl: "www.cancelUrl.com"
  });

  useEffect(() => {
    if (responseDvh) generateDvh();
  }, [responseDvh]);

  /* ==================== Functions ==================== */
  function removeKeys(param) {
    delete param.returnUrl;
    delete param.callbackUrl;
    delete param.cancelUrl;
    delete param.dvh;
    delete param.metaData;
    delete param.context;
    // console.log("-----param ", param);
    return param;
  }

  /* -------------------- FN generateDvh -------------------- */
  const computeDvh = filteredData => {
    const secretKey = "3568f8c73f3349dcbbc99362c130f7c8";

    const dvhString = Buffer.from(JSON.stringify(filteredData)).toString(
      "base64"
    );
    const hash = CryptoJS.HmacSHA512(dvhString, secretKey);
    return CryptoJS.enc.Hex.stringify(hash);
  };
  /* -------------------- FN generateDvh -------------------- */
  const generateDvh = () => {
    const secretKey = "3568f8c73f3349dcbbc99362c130f7c8";
    const filteredData = removeKeys({ ...data });

    console.log("-----filteredData ", filteredData);
    try {
      const dvhString = Buffer.from(JSON.stringify(filteredData)).toString(
        "base64"
      );
      const hash = CryptoJS.HmacSHA512(dvhString, secretKey);
      const result = CryptoJS.enc.Hex.stringify(hash);
      const tempData = { ...data, dvh: result };

      if (!responseDvh) {
        setData(tempData);
        // 1st API Call
        requestToken(tempData);
      } else if (responseDvh && responseDvh === result) {
        const { dvh: exclude, ...rest } = tempData;

        const requestObject = { ...rest, dvh: computeDvh(rest) };
        // console.log("---------tempData", rest);
        setData(rest);
        // 2nd API Call
        verifyRequest(requestObject);
      }
    } catch (error) {
      throw error;
    }
  };

  /* -------------------- FN handleChange -------------------- */
  const handleChange = e => {
    const { name, value } = e.target;
    setData(state => ({ ...state, [name]: value }));
  };

  /* -------------------- FN verifyRequest -------------------- */
  const verifyRequest = async param => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(param)
    };

    try {
      const fetchResponse = await fetch(
        "https://bfi-merchant.bitsbeat.com/api/v1/merchant/web-checkout/verify-request",
        settings
      );
      const { response, data: successData } = await fetchResponse.json();

      if (response.status === 200) {
        const { token, dvh, ...rest } = successData;
        window.location.replace(successData.webCheckoutUrl);
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* -------------------- FN requestToken -------------------- */
  const requestToken = async ({
    returnUrl,
    callbackUrl,
    cancelUrl,
    ...rest
  }) => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rest)
    };

    try {
      const fetchResponse = await fetch(
        "https://bfi-merchant.bitsbeat.com/api/v1/merchant/web-checkout/token",
        settings
      );
      const { response, data: successData } = await fetchResponse.json();

      if (response.status === 200) {
        if (!successType) {
          const { token, dvh, ...rest } = successData;
          console.log(successData);

          let validData = true;

          Object.keys(rest).forEach(x => {
            validData = validData && rest[x] === data[x];
          });

          if (validData) {
            setData(state => ({ ...state, token }));
            setResponseDvh(dvh);
            setSuccessType("initial Success");
          }
        }
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* -------------------- FN handleSubmit -------------------- */
  const handleSubmit = e => {
    e.preventDefault();
    if (submitType === "submit") {
      generateDvh();
    }
  };

  return (
    <FormUI
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      data={data}
      setData={setData}
      setSubmitType={setSubmitType}
    />
  );
}

export default withRouter(WebCheckout);

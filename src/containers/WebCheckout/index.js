import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import FormUI from "./components/FormUI";
import { withRouter } from "react-router-dom";

function WebCheckout(props) {
  /* ==================== React Hooks ==================== */
  const [submitType, setSubmitType] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [successType, setSuccessType] = useState("");

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
    callbackUrl: "www.callback.com"
  });

  useEffect(() => {
    if (isGenerated) {
      requestToken(data);
    }
  }, [isGenerated]);

  /* ==================== Functions ==================== */

  /* -------------------- FN generateDvh -------------------- */
  const generateDvh = () => {
    const secretKey = "3568f8c73f3349dcbbc99362c130f7c8";
    const tempData = { ...data };
    if (!successType) {
      delete tempData.returnUrl;
      delete tempData.callbackUrl;
      delete tempData.cancelUrl;
    }

    delete tempData.dvh;
    delete tempData.metaData;
    delete tempData.context;
    try {
      const dvhString = Buffer.from(JSON.stringify(tempData)).toString(
        "base64"
      );
      const hash = CryptoJS.HmacSHA512(dvhString, secretKey);
      const result = CryptoJS.enc.Hex.stringify(hash);
      setData(state => ({ ...state, dvh: result }));
      setIsGenerated(true);
    } catch (error) {
      throw error;
    }
  };

  /* -------------------- FN handleChange -------------------- */
  const handleChange = e => {
    const { name, value } = e.target;
    setData(state => ({ ...state, [name]: value }));
  };

  /* -------------------- FN requestToken -------------------- */
  const requestToken = async ({ returnUrl, callbackUrl, ...rest }) => {
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
      setIsGenerated(false);

      if (response.status === 200) {
        if (!successType) {
          const { token, ...rest } = successData;
          let validData = true;

          Object.keys(rest).forEach(x => {
            validData = validData && rest[x] === data[x];
            console.log([validData, rest[x], data[x], rest[x] === data[x]]);
          });

          setSuccessType("initial Success");
        }
        // history.push(successData.webCheckoutUrl);
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

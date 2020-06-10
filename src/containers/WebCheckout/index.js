import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import FormUI from "./components/FormUI";

export default function WebCheckout() {
  /* ---------------- React Hooks -------------------- */
  const [submitType, setSubmitType] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [data, setData] = useState({
    apiKey: "3568f8c7-3f33-49dc-bbc9-9362c130f7c8",
    amount: 100.5,
    currency: "NPR",
    bankCode: "GIBL",
    // referenceId: `pr${Date.now()}`,
    referenceId: ``,
    dvh: "",
    dateOfRequest: new Date().toLocaleDateString("fr-CA"),
    returnUrl: "www.return.com",
    callbackUrl: "www.callback.com"
  });

  useEffect(() => {
    if (isGenerated)
      requestToken({
        ...data,
        dateOfRequest: `${new Date(data.dateOfRequest).getTime()}`
      });
  }, [isGenerated]);

  /* ------------------ Function ------------------ */

  const generateDvh = () => {
    const secretKey = "3568f8c73f3349dcbbc99362c130f7c8";
    const { dvh, metaData, context, ...validationObject } = {
      ...data,
      dateOfRequest: `${new Date(data.dateOfRequest).getTime()}`
    };

    try {
      let dvhString = JSON.stringify(validationObject).toString("base64");
      const hash = CryptoJS.HmacSHA512(dvhString, secretKey);
      const result = CryptoJS.enc.Hex.stringify(hash);
      setData(state => ({ ...state, dvh: result }));
      setIsGenerated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setData(state => ({ ...state, [name]: value }));
  };

  const requestToken = async param => {
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
        "https://bfi-merchant.bitsbeat.com/api/v1/merchant/web-checkout/token",
        settings
      );
      const { response, data: successData } = await fetchResponse.json();
      setIsGenerated(false);
      console.log(response);
      if (response.status === 200) {
        window.location.replace(successData.webCheckoutUrl);
      } else {
        alert(response.message);
      }
      return response;
    } catch (e) {
      return e;
    }
  };

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

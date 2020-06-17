import React, { useState, useEffect } from "react";
import FormUI from "./components/FormUI";
import { withRouter } from "react-router-dom";
import {
  computeDvh,
  removeKeys,
  apiSettings as settings
} from "../commonHelper";

const API_BASE = "https://bfi-merchant.bitsbeat.com/api/v1/";

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
    cancelUrl: window.location.href
  });

  useEffect(() => {
    if (responseDvh) generateDvh();
  }, [responseDvh]);

  /* ==================== Functions ==================== */
  /* -------------------- FN generateDvh -------------------- */
  const generateDvh = () => {
    const filteredData = removeKeys({ ...data });
    try {
      const result = computeDvh(filteredData);
      const tempData = { ...data, dvh: result };
      if (!responseDvh) {
        setData(tempData);

        // 1st API Call
        requestToken(tempData);
      }
      //
      else if (responseDvh && responseDvh === result) {
        const { dvh: exclude, ...rest } = tempData;
        const requestObject = { ...rest, dvh: computeDvh(rest) };
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
    settings.body = JSON.stringify(param);
    try {
      const fetchResponse = await fetch(
        `${API_BASE}merchant/web-checkout/verify-request`,
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
    settings.body = JSON.stringify(rest);
    try {
      const fetchResponse = await fetch(
        `${API_BASE}merchant/web-checkout/token`,
        settings
      );
      const { response, data: successData } = await fetchResponse.json();

      if (response.status === 200) {
        if (!successType) {
          const { token, dvh, ...rest } = successData;

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

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
    if (responseDvh) {
      const filteredData = removeKeys({ ...data });
      const result = computeDvh(filteredData);

      if (responseDvh === result) {
        const { dvh: exclude, ...rest } = data;
        const requestObject = { ...rest, dvh: computeDvh(rest) };
        setData(rest);

        // 2nd API Call
        verifyRequest(requestObject);
      }
    }
  }, [responseDvh]);

  /* ==================== Functions ==================== */
  // /* -------------------- FN generateDvh -------------------- */
  // const generateDvh = () => {
  //   const filteredData = removeKeys({ ...data });
  //   try {
  //     const result = computeDvh(filteredData);
  //     const tempData = { ...data, dvh: result };
  //     if (!responseDvh) {
  //       setData(tempData);

  //       // 1st API Call
  //       requestToken(tempData);
  //     }
  //     //
  //     else if (responseDvh && responseDvh === result) {
  //       const { dvh: exclude, ...rest } = tempData;
  //       const requestObject = { ...rest, dvh: computeDvh(rest) };
  //       setData(rest);

  //       // 2nd API Call
  //       verifyRequest(requestObject);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  /* -------------------- FN handleGenerateDvh -------------------- */
  const handleGenerateDvh = () => {
    const filteredData = removeKeys({ ...data });
    try {
      const result = computeDvh(filteredData);
      setData(state => ({ ...state, dvh: result }));
    } catch (e) {
      console.error(e);
    }
  };

  /* -------------------- FN handleChange -------------------- */
  const handleChange = e => {
    const { name, value } = e.target;
    setData(state => ({ ...state, [name]: value }));
  };

  /* --------------------2nd API Call FN verifyRequest -------------------- */
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

  /* --------------------1st API Call FN requestToken -------------------- */
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
        const { token, dvh, ...rest } = successData;

        let validData = true;
        Object.keys(rest).forEach(x => {
          validData = validData && rest[x] === data[x];
          console.log([x, rest[x], data[x]]);
        });

        if (validData) {
          setData(state => ({ ...state, token }));
          setResponseDvh(dvh);
        } else {
          alert("Sent data & received data does not match!");
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
      if (data.dvh) {
        // 1st API Call
        requestToken(data);
      }
    }
  };

  return (
    <FormUI
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleGenerateDvh={handleGenerateDvh}
      data={data}
      setData={setData}
      setSubmitType={setSubmitType}
    />
  );
}

export default withRouter(WebCheckout);

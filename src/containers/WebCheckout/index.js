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

  const [merchantList, setMerchantList] = useState([
    {
      name: "Web Checkout",
      apiKey: "3568f8c7-3f33-49dc-bbc9-9362c130f7c8",
      secretKey: "3568f8c73f3349dcbbc99362c130f7c8",
      active: true
    },
    {
      name: "Western Tandoori",
      apiKey: "619cda33-b3e9-43ee-a938-c62a044fb7f2",
      secretKey: "cbac3523560c4f0580a29441481d785d"
    },
    {
      name: "Delicious Momo",
      apiKey: "e8c961a9-3268-4ed7-939f-943835402173",
      secretKey: "a723551b1b004d60b43d36534d5f61bf"
    }
  ]);

  const [selectedMerchantData, setSelectedMerchantData] = useState({
    name: "",
    secretKey: ""
  });

  useEffect(() => {
    const { name, secretKey } = merchantList.find(x => x.active) || {};
    if (name && secretKey) {
      setSelectedMerchantData({ name, secretKey });
    }
  }, []);

  useEffect(() => {
    if (responseDvh) {
      const filteredData = removeKeys({ ...data });
      const result = computeDvh(filteredData, selectedMerchantData.secretKey);

      if (responseDvh === result) {
        const { dvh: exclude, ...rest } = data;
        const requestObject = {
          ...rest,
          dvh: computeDvh(rest, selectedMerchantData.secretKey)
        };
        setData(rest);

        // 2nd API Call
        verifyRequest(requestObject);
      }
    }
  }, [responseDvh]);

  /* -------------------- FN handleMerchantSelection -------------------- */
  const handleMerchantSelection = param => {
    setMerchantList(
      merchantList.map(x => ({ ...x, active: x.name === param.name }))
    );
    setSelectedMerchantData({ name: param.name, secretKey: param.secretKey });
    setData(state => ({ ...state, apiKey: param.apiKey }));
  };

  /* -------------------- FN handleGenerateDvh -------------------- */
  const handleGenerateDvh = () => {
    const filteredData = removeKeys({ ...data });
    try {
      const result = computeDvh(filteredData, selectedMerchantData.secretKey);
      setData(state => ({ ...state, dvh: result }));
    } catch (e) {
      console.error(e);
    }
  };

  /* -------------------- FN handleChange -------------------- */
  const handleChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
      case "secretKey": {
        setSelectedMerchantData(state => ({ ...state, [name]: value }));
        break;
      }
      default: {
        setData(state => ({ ...state, [name]: value }));
        break;
      }
    }
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
      // const { status, message, data: successData } = await fetchResponse.json();
      const { response, data: successData } = await fetchResponse.json();
      if (response.status && response.status === 200) {
        const { token, dvh, ...rest } = successData;
        let validData = true;
        Object.keys(rest).forEach(x => {
          validData = validData && rest[x] === data[x];
        });

        if (validData) {
          setData(state => ({ ...state, token }));
          setResponseDvh(dvh);
        } else {
          alert("Sent data & received data does not match!");
        }
      } else {
        alert(response.message || response.response.message);
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
      handleMerchantSelection={handleMerchantSelection}
      merchantList={merchantList}
      selectedMerchant={selectedMerchantData}
      data={data}
      setData={setData}
      setSubmitType={setSubmitType}
    />
  );
}

export default withRouter(WebCheckout);

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import RedirectForm from "./components/RedirectForm";

function RedirectPage(props) {
  const [submitType, setSubmitType] = useState("");
  const [successType, setSuccessType] = useState("");
  const [responseDvh, setResponseDvh] = useState("");
  const [data, setData] = useState({
    merchantCode: "Some Value",
    bankCode: "Some Value",
    orderNumber: "Some Value",
    tokenId: "Some Value",
    amount: "Some Value",
    charge: "Some Value",
    discount: "Some Value",
    txnId: "Some Value"
  });

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  const search = props.location.search.substring(1);
  console.log(getParameterByName(search));

  const handleChange = e => {
    const { name, value } = e.target;
    // setData(state => ({ ...state, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (submitType === "submit") {
      console.log("submit");
    }
  };
  return (
    <RedirectForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      data={data}
      setData={setData}
      setSubmitType={setSubmitType}
    />
  );
}
export default withRouter(RedirectPage);

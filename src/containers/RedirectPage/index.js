import React, { useState, useEffect } from "react";
import FailurePage from "./FailurePage";

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const RedirectPage = () => {
  const { data } = useState({});
  useEffect(() => {
    let data = getParameterByName("data");
    let transactionDetail = JSON.parse(
      Buffer.from(data, "base64").toString("ascii")
    );
    console.log(transactionDetail);
  }, []);
  return (
    <div>
      <FailurePage />
    </div>
  );
};

export default RedirectPage;

import CryptoJS from "crypto-js";

/* -------------------- FN removeKeys -------------------- */
const removeKeys = param => {
  delete param.returnUrl;
  delete param.callbackUrl;
  delete param.cancelUrl;
  delete param.dvh;
  delete param.metaData;
  delete param.context;
  return param;
};

/* -------------------- FN computeDvh -------------------- */
const computeDvh = filteredData => {
  const secretKey = "3568f8c73f3349dcbbc99362c130f7c8";
  const dvhString = Buffer.from(JSON.stringify(filteredData)).toString(
    "base64"
  );
  const hash = CryptoJS.HmacSHA512(dvhString, secretKey);
  return CryptoJS.enc.Hex.stringify(hash);
};

/* -------------------- FN getParameterByName -------------------- */
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

/* -------------------- FN dataExtractor -------------------- */
const dataExtractor = extractedData => {
  try {
    let transactionDetail = JSON.parse(
      Buffer.from(extractedData, "base64").toString("ascii")
    );

    return transactionDetail;
    // return Buffer.from(extractedData, "base64").toString("ascii");
  } catch (e) {
    console.error(e);
  }
};

/* -------------------- CONST apiSettings -------------------- */
const apiSettings = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export {
  removeKeys,
  computeDvh,
  apiSettings,
  getParameterByName,
  dataExtractor
};

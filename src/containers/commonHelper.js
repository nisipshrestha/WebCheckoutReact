import CryptoJS from 'crypto-js';

/* -------------------- FN removeKeys -------------------- */
const removeKeys = (param) => {
  delete param.returnUrl;
  delete param.callbackUrl;
  delete param.cancelUrl;
  delete param.dvh;
  delete param.metaData;
  delete param.context;
  return param;
};

/* -------------------- FN computeDvh -------------------- */
const computeDvh = (data, secretKey = '3568f8c73f3349dcbbc99362c130f7c8') => {
  const sortedData = Object.fromEntries(
    Object.entries(data).sort(([a], [b]) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    )
  );
  const dvhString = Buffer.from(JSON.stringify(sortedData)).toString('base64');
  const hash = CryptoJS.HmacSHA512(dvhString, secretKey);
  return CryptoJS.enc.Hex.stringify(hash);
};

/* -------------------- FN getParameterByName -------------------- */
const getParameterByName = (name, url) => {
  if (!name) return '';
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/* -------------------- FN dataExtractor -------------------- */
const dataExtractor = (extractedData) => {
  try {
    let transactionDetail = JSON.parse(
      Buffer.from(extractedData, 'base64').toString('ascii')
    );

    return transactionDetail;
    // return Buffer.from(extractedData, "base64").toString("ascii");
  } catch (e) {
    console.error(e);
  }
};

/* -------------------- CONST apiSettings -------------------- */
const apiSettings = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

/* -------------------- CONST apiSettings -------------------- */
const environmentMapper = {
  Development: 'dev-merchant.swifttech.com.np/',
  Testing: 'bfi-dev-merchant.ospsb.com/',
  Demo: 'bfi-demo-merchant.ospsb.com/',
  Poc: 'poc-merchant.ospsb.com/',
  Vapt: 'bfirh-merchant.ospsb.com/',
};

const environmentSelectorList = [
  { label: 'Development', value: 'Development' },
  { label: 'Testing', value: 'Testing' },
  { label: 'Demo / Staging', value: 'Demo' },
  { label: 'POC', value: 'Poc' },
  { label: 'VAPT', value: 'Vapt' },
];

const apiBaseSetter = (env) =>
  `https://${environmentMapper[env || 'Development']}api/v1/`;

const API_BASE = apiBaseSetter(localStorage.getItem('env'));

export {
  removeKeys,
  computeDvh,
  apiSettings,
  getParameterByName,
  dataExtractor,
  API_BASE,
  apiBaseSetter,
  environmentSelectorList,
};

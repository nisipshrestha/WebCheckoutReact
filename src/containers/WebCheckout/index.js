import React, { useState, useEffect } from 'react';
import FormUI from './components/FormUI';
import { withRouter } from 'react-router-dom';
import {
  computeDvh,
  removeKeys,
  apiSettings as settings,
  apiBaseSetter
} from '../commonHelper';
import MerchantList from '../MerchantList';
const initialData = {
  apiKey: '3568f8c7-3f33-49dc-bbc9-9362c130f7c8',
  amount: 100.5,
  currency: 'NPR',
  bankCode: 'GIBL',
  referenceId: `pr${Date.now()}`,
  // referenceId: ``,
  dvh: '',
  dateOfRequest: new Date().toLocaleDateString('fr-CA'),
  returnUrl: `${window.location.href}redirectPage`,
  callbackUrl: 'www.callback.com',
  cancelUrl: window.location.href
};
function WebCheckout(props) {
  /* ==================== React Hooks ==================== */
  const [submitType, setSubmitType] = useState('');
  const [responseDvh, setResponseDvh] = useState('');
  const [data, setData] = useState(initialData);
  const [env, setEnv] = useState(localStorage.getItem('env') || 'Development');

  const [merchantList, setMerchantList] = useState(MerchantList);

  const [selectedMerchantData, setSelectedMerchantData] = useState({
    name: '',
    secretKey: ''
  });
  useEffect(() => {
    const { name, secretKey } = merchantList.find(x => x.env === env) || {};
    console.log([name, secretKey, env]);
    if (name && secretKey) {
      setSelectedMerchantData({ name, secretKey, active: true });
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
      case 'name':
      case 'secretKey': {
        setSelectedMerchantData(state => ({ ...state, [name]: value }));
        break;
      }
      case 'environment': {
        if (value) {
          setEnv(value);
          localStorage.setItem('env', value);
          const tempMerchant = merchantList.find(x => x.env === value);
          handleMerchantSelection(tempMerchant);
        }
        break;
      }
      case 'amount': {
        setData(state => ({ ...state, [name]: parseFloat(value) }));
        break;
      }

      default: {
        setData(state => ({ ...state, [name]: value }));
        break;
      }
    }
  };

  /* --------------------2nd API Call FN verifyRequest -------------------- */
  const verifyRequest = async ({ dvh, ...rest }) => {
    settings.body = JSON.stringify(rest);
    settings.headers = { dvh, 'content-type': 'application/json' };
    try {
      const fetchResponse = await fetch(
        `${apiBaseSetter(env)}merchant/web-checkout/verify-request`,
        settings
      );
      const { response = {}, data: successData } = await fetchResponse.json();
      if (response.status && response.status === 200) {
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
    dvh,
    ...rest
  }) => {
    settings.headers = { dvh, 'content-type': 'application/json' };
    const tempData = { ...rest };
    settings.body = JSON.stringify(tempData);

    try {
      const fetchResponse = await fetch(
        `${apiBaseSetter(env)}merchant/web-checkout/token`,
        settings
      );
      // const { status, message, data: successData } = await fetchResponse.json();
      const { response = {}, data: successData } = await fetchResponse.json();
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
          alert('Sent data does not match with received data!');
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
    if (submitType === 'submit') {
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
      env={env}
      setData={setData}
      setSubmitType={setSubmitType}
    />
  );
}

export default withRouter(WebCheckout);

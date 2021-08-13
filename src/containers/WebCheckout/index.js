import React, { useState, useEffect } from 'react';
import FormUI from './components/FormUI';
import { withRouter } from 'react-router-dom';
import {
  computeDvh,
  removeKeys,
  apiSettings as settings,
  apiBaseSetter
} from '../commonHelper';

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

  const [merchantList, setMerchantList] = useState([
    {
      env: 'Development',
      name: 'Web Checkout - Development',
      apiKey: '3568f8c7-3f33-49dc-bbc9-9362c130f7c8',
      secretKey: '3568f8c73f3349dcbbc99362c130f7c8',
      active: true
    },
    {
      env: 'Development',
      name: 'Western Tandoori - Development',
      apiKey: '619cda33-b3e9-43ee-a938-c62a044fb7f2',
      secretKey: 'cbac3523560c4f0580a29441481d785d'
    },
    {
      env: 'Development',
      name: 'Delicious Momo - Development',
      apiKey: 'e8c961a9-3268-4ed7-939f-943835402173',
      secretKey: 'a723551b1b004d60b43d36534d5f61bf'
    },
    {
      env: 'Testing',
      name: 'Web Checkout - Testing',
      apiKey: '9c139d2a-0172-4e98-82f2-f4bb6d79e771',
      secretKey: '1af9450b30b942a888859be131345c18'
    },
    {
      env: 'Demo',
      name: 'Web Checkout - Demo',
      apiKey: 'a276f6ea-fb28-4e89-ae88-25394d7de72e',
      secretKey: '5f8907d7b9b04a44956e8e079a362c68 '
    },
    {
      env: 'Poc',
      name: 'Web Checkout - POC',
      apiKey: '128d26ed-4c85-4327-b439-82bbd5b2cdb8',
      secretKey: '0e2a029569cd4347940346a0ac4a480e'
    },
    {
      env: 'Vapt',
      name: 'webcheckout merchant RH1',
      apiKey: '50120dda-d274-4501-8800-ddee6ef07b99',
      secretKey: '61d939510a3642cbab5f237ff92ff8a2'
    }
  ]);

  const [selectedMerchantData, setSelectedMerchantData] = useState({
    name: '',
    secretKey: ''
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
    settings.body = JSON.stringify(rest);

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

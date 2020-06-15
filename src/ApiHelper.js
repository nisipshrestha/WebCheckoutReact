const settings = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

function handleFetch(url, body = null) {
  
}

function post(url, body) {
  settings.method = "POST";
  settings.body = JSON.stringify(body);

  try {
    (async () => {
      const fetchResponse = await fetch(url, settings);
      const { response, data: successData } = await fetchResponse.json();
      setIsGenerated(false);

      if (response.status === 200) {
        // history.push(successData.webCheckoutUrl);
      } else {
        alert(response.message);
      }
    })();
  } catch (e) {
    console.error(e);
  }
}
function handleGet() {}

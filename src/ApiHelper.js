function handlePost(url, body) {
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  try {
    (async () => {
      const fetchResponse = await fetch(url, settings);
      const { response, data: successData } = await fetchResponse.json();
      setIsGenerated(false);

      console.log(response);
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

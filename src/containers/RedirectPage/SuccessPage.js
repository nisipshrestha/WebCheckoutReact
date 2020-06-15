import React from "react";
import { withRouter } from "react-router-dom";
import RedirectForm from "./components/RedirectForm";

function RedirectPage(props) {
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

  return (
    <RedirectForm
     
      data={data}
    
    />
  );
}
export default withRouter(RedirectPage);

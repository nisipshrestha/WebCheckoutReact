import React from "react";
import { withRouter } from "react-router-dom";
function RedirectPage(props) {
  var a = {
    token:
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiIzNTY4ZjhjNy0zZjMzLTQ5ZGMtYmJjOS05MzYyYzEzMGY3YzgiLCJyZWZlcmVuY2VJZCI6ImRhcmF6LTEyMzQzODU2ODQwOCIsImlhdCI6MTU5MTg1MjY5MCwiZXhwIjoxNTkyMTExODkwfQ.JfM-QC70lXKzmBeuq7AhJMECdeV036X-8MnazNq6ngLE0DUZyHNpWXhLBThjPk9xL0FaRviZa5mwpg4UTqHVEw",
    referenceId: "pr1591880007655"
  };
  console.log(JSON.stringify((a)).toString("base64"));
  if ((props.location || {}).search) {
    const search = props.location.search.substring(1);
    const parsedVal = JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );

    console.log(parsedVal);
  }
  return (
    <>
      <h1>asdf</h1>
    </>
  );
}
export default withRouter(RedirectPage);

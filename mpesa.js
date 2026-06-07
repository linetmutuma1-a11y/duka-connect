import dotenv from "dotenv";

dotenv.config();
////get access token
const SANDBOX_MPESA_CONSUMER_KEY=process.env.SANDBOX_MPESA_CONSUMER_KEY;

const SANDBOX_MPESA_CONSUMER_SECRET=process.env.SANDBOX_MPESA_CONSUMER_SECRET;

 async function getMpesaAccessToken() {
    try {
    const binarystring = `${SANDBOX_MPESA_CONSUMER_KEY}:${SANDBOX_MPESA_CONSUMER_SECRET}`;
    const encodedBase64AuthDtls = btoa(binarystring);

    
     const response = await fetch(
     'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
            method: "GET",
            headers: {
                Authorization: `Basic ${encodedBase64AuthDtls}`,
                "Content-Type": "application/json",
            },
        },
    );
    const dtls = await response.json();
    console.log(dtls);
    return dtls;
}catch(error){
 console.error(error);
}
}

// getMpesaAccessToken();

function generateTimestamp() {
      
      const date = new Date();
      return ( 
        String(date.getFullYear()) +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0") +
        String(date.getHours()).padStart(2, "0") +
        String(date.getMinutes()).padStart(2, "0") +
        String(date.getSeconds()).padStart(2, "0")
  );}

async function sendMpesaSTKPush() {
  try {

    const { access_token } = await getMpesaAccessToken(); 
    const passkey = 
    process.env.SANDBOX_MPESA_PASSKEY;
    const BusinessShortCode = 174379;

    const Timestamp = generateTimestamp();
    
    const password = btoa(`${BusinessShortCode}${passkey}${Timestamp}`);
    const paymentDtls = {
      BusinessShortCode: "174379",
      Password: password,
      Timestamp: Timestamp,
      TransactionType: "CustomerPayBillOnline", 
      Amount: 1,
      PartyA: 254717587968, 
      PartyB: 174379,
      PhoneNumber: 254717587968, 
      CallBackURL: process.env.SANDBOX_CALLBACK_URL,
      AccountReference: "123456789",
      TransactionDesc: "Integration",
    };

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDtls),
      },
    ); 
    console.log( "STK PUSH HTTP STATUS:",
    response.status
);

    const resDtls = await response.json();
    console.log("STK PUSH RESPONSE");
    console.log(resDtls);
    return resDtls;
  } catch (error) {
    console.log(error);
  }
}
// sendMpesaSTKPush();


// query STK status
async function querySTKStatus(checkoutRequestId) {  

try {
    const { access_token } = await getMpesaAccessToken();
    const passkey = 
    process.env.SANDBOX_MPESA_PASSKEY;
    const BusinessShortCode = 174379;

    const Timestamp = generateTimestamp();
    const password = btoa(`${BusinessShortCode}${passkey}${Timestamp}`);
    const payload = {
      BusinessShortCode,
        Password: password,
        Timestamp,
        CheckoutRequestID: checkoutRequestId
    };
    console.log("QUERY PAYLOAD");
    console.log(payload);

    const response = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
    {
      method: "POST",
      headers: {
         Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    },
    );
    console.log( "QUERY HTTP STATUS:",
    response.status
);

    const resDtls = await response.json();
    console.log(
      "===== PAYMENT STATUS ====="
    );

    console.log(resDtls);

    return resDtls;
  } catch (error) {
    console.log(error);
  } 
}

async function test() {

  try {

    const stkResponse =
      await sendMpesaSTKPush();

    const checkoutRequestId =
      stkResponse.CheckoutRequestID;

    console.log(
      "CHECKOUT REQUEST ID:"
    );

    console.log(
      checkoutRequestId
    );

    if (!checkoutRequestId) {

      console.log(
        "No CheckoutRequestID returned."
      );

      return;
    }

    console.log(
      "Waiting 15 seconds..."
    );

    await new Promise(resolve =>
      setTimeout(resolve, 15000)
    );

    await querySTKStatus(
      checkoutRequestId
    );

  } catch (error) {
    console.error(error);
  }
}


 export {
  sendMpesaSTKPush,
  querySTKStatus
};
import React, { useState } from 'react';
import '../App.css';

const Payment = () => {
  const [showQRCode, setShowQRCode] = useState(false);

  const toggleQR = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div>
      <div className="payment-box">
        <h1>Payment Options</h1>
        <div className="upi-box">
          <label>Pay through UPI ID</label>
          <input name="UPI" type="text" id="upi-input" />
          <button type="button" className="pay-btn">Pay</button>
        </div>
        <div className="bank-transfer">
          <label>Pay through Bank Transfer</label>
          <input name="Bank" type="text" id="bank-input" />
          <button type="button" className="pay-btn">Pay</button>
        </div>
        <div className="qr-code">
          <label>Pay through QR Code</label>
          <button type="button" id="qr-toggle" onClick={toggleQR}>
            {showQRCode ? "Hide QR code" : "Show QR code"}
          </button>
          {showQRCode && (
            <div className="qr-image">
              <img src={`${process.env.PUBLIC_URL}/Images/QRcode.png`} alt="QR Code" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
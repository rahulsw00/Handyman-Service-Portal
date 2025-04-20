// src/UpiLink.tsx
import React from "react";
import QRCode from "react-qr-code";

const UpiLink: React.FC = () => {
  const upiUrl =
    "upi://pay?pa=utkarsh.9486%40waaxis&pn=Handyman&tn=Order&am=100.34&cu=INR";

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 p-4">
      <h2>Pay with UPI</h2>
      <p>
        Scan the QR code or click the link below to pay ₹100.34 to Handyman.
      </p>
      <div
        style={{
          background: "white",
          padding: "16px",
          display: "inline-block",
        }}
      >
        <QRCode value={upiUrl} />
      </div>
    </div>
  );
};

export default UpiLink;

import React from "react";
import { useVerification} from "../../context/VerificationContext"; // Import the context

export const VerificationMessage: React.FC = () => {
    const { verificationResult } = useVerification();
    if(!verificationResult){
        return null;
    }
    const isVerified = verificationResult.status === "verified";

  return (
    <div
      className={`mt-6 p-4 rounded-lg ${
        isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <h3 className="text-lg font-semibold">
        {isVerified ? "Verification Successful" : "Verification Failed"}
      </h3>
    </div>
  );
};
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
      {isVerified ? (
        <div className="mt-4 space-y-2">
          <p>
            <strong>Student Name:</strong> {verificationResult.studentName}
          </p>
          <p>
            <strong>Certificate Type:</strong> {verificationResult.certificateType}
          </p>
          <p>
            <strong>Issue Date:</strong> {new Date(verificationResult.issueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Institution Name:</strong> {verificationResult.institutionName}
          </p>
        </div>
      ) : (
        <p className="mt-2">
          {verificationResult.pdfUrl || "No additional details available."}
        </p>
      )}
    </div>
  );
};
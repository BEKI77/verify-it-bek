import React, { createContext, useContext, useState } from "react";
import { Certificate } from "../types";

// Create the context
const VerificationContext = createContext<{
  verificationResult: Certificate | null;
  setVerificationResult: React.Dispatch<React.SetStateAction<Certificate | null>>;
} | null>(null);

// Create a custom hook to use the context
export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
};

interface VerificationProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const VerificationProvider: React.FC<VerificationProviderProps> = ({ children }) => {
  const [verificationResult, setVerificationResult] = useState<Certificate | null>(null);

  return (
    <VerificationContext.Provider value={{ verificationResult, setVerificationResult }}>
      {children}
    </VerificationContext.Provider>
  );
};
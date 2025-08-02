import { createContext, useContext, useState, ReactNode } from "react";

interface Institution {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  approved: boolean;
  userId: number;
}

interface InstitutionContextProps {
  institution: Institution | null;
  setInstitution: (institution: Institution | null) => void;
}

const InstitutionContext = createContext<InstitutionContextProps | undefined>(
  undefined
);

export const InstitutionProvider = ({ children }: { children: ReactNode }) => {
  const [institution, setInstitution] = useState<Institution | null>(null);

  return (
    <InstitutionContext.Provider value={{ institution, setInstitution }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = (): InstitutionContextProps => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitution must be used within an InstitutionProvider");
  }
  return context;
};
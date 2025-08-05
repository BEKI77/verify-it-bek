export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'institution' | 'verifier';
  imageUrl?: string;
  schoolName?: string;
  institutionLogo?: string;
  contactInfo?: string;
}


export interface Certificate {
  certificateId: string;
  fullName: string;
  program: string;
  fieldOfStudy: string;
  institutionId: number;
  institutionName: string;
  institutionsEmail: string;
  issuedAt: string;
  expiresAt: string | null;
  status: string;
  fileUrl: string | null;
  verified: boolean;
  hash: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password:string) => Promise<User['role'] | null>;
  handleAuthCallback: (user:any) =>  Promise<User['role'] | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showSidebar: boolean;
}
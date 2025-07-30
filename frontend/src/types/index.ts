export interface User {
  id: string;
  name: string;
  email: string;
  faydaId: string;
  role: 'student' | 'institution' | 'verifier';
  avatar?: string;
  schoolName?: string;
  institutionLogo?: string;
  contactInfo?: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  institutionName: string;
  certificateType: string;
  issueDate: string;
  verificationCode: string;
  status: 'pending' | 'verified' | 'rejected';
  pdfUrl?: string;
  notes?: string;
  qrCode?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, role: User['role']) => void;
  handleAuthCallback: (user:User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
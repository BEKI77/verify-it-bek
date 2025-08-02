export enum User_Role {
  Admin = 'admin',
  Institute = 'institution',
  User = 'user',
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: User_Role;
}


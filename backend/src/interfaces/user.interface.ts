export enum User_Role {
  Admin = 'admin',
  Institute = 'institute',
  User = 'user',
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: User_Role;
}
import { User } from './user';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

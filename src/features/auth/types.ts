/**
 * Mobile POS only allows the `retailer` role to authenticate. Any other role
 * (admin, super-admin, qwuik-admin, regular customer) is rejected by the
 * auth service and redirected back to the login screen with an error.
 */
export const ALLOWED_ROLES = ['retailer'] as const;
export type AllowedRole = (typeof ALLOWED_ROLES)[number];

export type UserRole =
  | 'user'
  | 'admin'
  | 'super-admin'
  | 'qwuik-admin'
  | 'retailer';

export interface RetailerUser {
  $id: string;
  id: string;
  name: string;
  email: string;
  image?: string;
  status: number;
  type: UserRole;
  mobileNumber?: string;
  storeId?: string;
  companyId?: string;
  brandId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'invalid-credentials'
      | 'forbidden-role'
      | 'profile-missing'
      | 'network'
      | 'unknown' = 'unknown'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

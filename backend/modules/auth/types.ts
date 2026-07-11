export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'BUYER' | 'SELLER';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
  };
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  isVerified: boolean;
  company?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
    logoUrl?: string;
    isVerified: boolean;
  };
  createdAt: Date;
}

export interface CompanyDTO {
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

import { AppError } from '../../core/errors';
import { hashPassword, comparePassword, generateToken } from '../../core/utils/helpers';
import * as authRepo from './repository';
import { RegisterDTO, LoginDTO, AuthResponse, UserProfile, CompanyDTO } from './types';

function sanitizeUser(user: { id: string; email: string; name: string; role: string; phone: string | null }): AuthResponse['user'] {
  return { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone ?? undefined };
}

export async function register(data: RegisterDTO): Promise<AuthResponse> {
  const existing = await authRepo.findUserByEmail(data.email);
  if (existing) throw new AppError(409, 'Email already registered');

  const hashed = await hashPassword(data.password);
  const user = await authRepo.createUser({ ...data, password: hashed });

  const token = generateToken({ userId: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function login(data: LoginDTO): Promise<AuthResponse> {
  const user = await authRepo.findUserByEmail(data.email);
  if (!user) throw new AppError(401, 'Invalid email or password');

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new AppError(401, 'Invalid email or password');

  const token = generateToken({ userId: user.id, role: user.role });
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  return authRepo.findUserById(userId) as Promise<UserProfile | null>;
}

export async function updateProfile(userId: string, data: { name?: string; phone?: string }) {
  const user = await authRepo.updateUser(userId, data);
  return sanitizeUser(user);
}

export async function getCompany(ownerId: string) {
  return authRepo.findCompanyByOwner(ownerId);
}

export async function createOrUpdateCompany(ownerId: string, data: CompanyDTO) {
  if (!data.name) throw new AppError(400, 'Company name is required');
  return authRepo.upsertCompany(ownerId, data);
}

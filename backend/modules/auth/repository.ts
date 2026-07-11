import prisma from '../../core/database';
import { RegisterDTO, CompanyDTO } from './types';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, name: true, phone: true, role: true,
      avatarUrl: true, isVerified: true, createdAt: true,
      company: { select: { id: true, name: true, city: true, state: true, logoUrl: true, isVerified: true } },
    },
  });
}

export function createUser(data: RegisterDTO & { password: string }) {
  return prisma.user.create({
    data,
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });
}

export function updateUser(id: string, data: { name?: string; phone?: string }) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, phone: true, role: true },
  });
}

export function findCompanyByOwner(ownerId: string) {
  return prisma.company.findUnique({ where: { ownerId } });
}

export function upsertCompany(ownerId: string, data: CompanyDTO) {
  return prisma.company.upsert({
    where: { ownerId },
    update: data,
    create: { ...data, ownerId },
  });
}

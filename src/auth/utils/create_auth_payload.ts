import { User as PrismaUser, Role } from '@prisma/client';

export interface UserWithRoles extends PrismaUser {
  roles: Role[];
}

export const create_auth_payload = (user: UserWithRoles) => {
    return {
      username: user.username,
      sub: user.id,
      roles: user.roles.map(role => ({ id: role.id, name: role.name })),
    };
  };
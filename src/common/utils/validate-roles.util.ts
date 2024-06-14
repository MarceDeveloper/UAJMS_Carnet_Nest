import { PrismaService } from "src/prisma/prisma.service";

export async function is_validateRoles(prisma: PrismaService, roleIds: number[]): Promise<boolean> {
  const roles = await prisma.role.findMany({
    where: { id: { in: roleIds } },
  });

  return roles.length === roleIds.length;
}

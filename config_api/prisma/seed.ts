import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  const adminPassword = await bcrypt.hash('123456', 10); // Cambia la contraseña aquí según sea necesario

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' }, // Asegúrate de que este correo sea único
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      roles: {
        create: {
          role: {
            connect: { id: adminRole.id },
          },
        },
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

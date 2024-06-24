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
      nombre: 'Administrador',
      apellido: 'Principal',
      fecha_nacimiento: new Date('1970-01-01'),
      direccion: 'Dirección de ejemplo',
      ci: '12345678',
      foto_perfil: null, // Asigna un valor o déjalo como null
      foto_baner: null, // Asigna un valor o déjalo como null
      color_tema: 'default', // O cualquier color por defecto
      celular: '555-1234',
      contador_interaccion_correo: 0,
      contador_interaccion_whatsapp: 0,
      contador_interaccion_telefono: 0,
      contador_interaccion_direccion: 0,
      roles: {
        create: {
          role: {
            connect: { id: adminRole.id },
          },
        },
      },
      enlaces: {
        create: [
          {
            url: 'https://example.com',
            nombre: 'Ejemplo',
            icon: 'MdLink',
            contador_interacciones: 0,
          },
        ],
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

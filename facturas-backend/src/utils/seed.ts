import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "freelancer@test.com" },
    update: {},
    create: {
      email: "freelancer@test.com",
      password: hashedPassword,
      name: "Freelancer de Prueba",
    },
  });

  console.log("✅ Usuario creado:", user.email);

  // Crear clientes de prueba
  const client1 = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      name: "Empresa ABC S.A. de C.V.",
      rfc: "ABC123456789",
      email: "contacto@empresaabc.com",
      fiscalAddress: "Av. Principal 123, Col. Centro, Ciudad de México",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user.id,
      name: "Startup XYZ",
      rfc: "XYZ987654321",
      email: "admin@startupxyz.com",
      fiscalAddress: "Calle Innovación 456, Col. Tecnológica, Guadalajara",
    },
  });

  console.log("✅ Clientes creados:", client1.name, client2.name);

  // Crear facturas de prueba
  const invoice1 = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: client1.id,
      generalDiscount: 0.05, // 5%
      subtotal: 20000,
      iva: 3040, // 16% sobre subtotal con descuento
      isr: 0,
      total: 23040,
      items: {
        create: [
          {
            description: "Desarrollo de sitio web corporativo",
            quantity: 40,
            unit: "horas",
            unitPrice: 500,
            itemDiscount: 0,
            subtotal: 20000,
          },
        ],
      },
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: client2.id,
      generalDiscount: 0,
      subtotal: 15000,
      iva: 2400, // 16%
      isr: 1500, // 10%
      total: 15900,
      finalized: true,
      items: {
        create: [
          {
            description: "Consultoría en transformación digital",
            quantity: 20,
            unit: "horas",
            unitPrice: 750,
            itemDiscount: 0,
            subtotal: 15000,
          },
        ],
      },
    },
  });

  console.log("✅ Facturas creadas:", invoice1.id, invoice2.id);

  console.log("🎉 Seed completado exitosamente!");
  console.log("\n📧 Usuario de prueba:");
  console.log("Email: freelancer@test.com");
  console.log("Password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

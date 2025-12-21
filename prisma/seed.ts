import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.create({ data: { name: "ADMIN" } });
  const handlerRole = await prisma.role.create({ data: { name: "HANDLER" } });
  const userRole = await prisma.role.create({ data: { name: "USER" } });

  await prisma.permission.createMany({
    data: [
      { name: "CREATE_TICKET", roleId: handlerRole.id },
      { name: "ASSIGN_TICKET", roleId: handlerRole.id },
      { name: "DELETE_TICKET", roleId: adminRole.id },
      { name: "MANAGE_USERS", roleId: adminRole.id },
    ],
  });

  const users = [
    {
      email: "admin@example.com",
      name: "Admin",
      password: "StrongP@ssw0rd123!",
      roleId: adminRole.id,
    },
    {
      email: "handler@example.com",
      name: "Handler",
      password: "StrongP@ssw0rd123!",
      roleId: handlerRole.id,
    },
    {
      email: "user@example.com",
      name: "Regular User",
      password: "StrongP@ssw0rd123!",
      roleId: userRole.id,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        roleId: user.roleId,
      },
    });
  }

  console.log("✅ Seed klar!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

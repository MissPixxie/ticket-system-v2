import { auth } from "~/server/better-auth";
import { db } from "~/server/db";

async function main() {

    await db.permission.createMany({
    data: [
      { name: "CREATE_TICKET"},
      { name: "ASSIGN_TICKET" },
      { name: "DELETE_TICKET"},
      { name: "MANAGE_USERS"},
    ],
  });

  const adminRole = await db.role.create({
    data: {
      name: "ADMIN",
      permissions: {
         connect: [
          { name: "MANAGE_USERS" },
          { name: "DELETE_TICKET" },
         ]}
      }
    });

  const handlerRole = await db.role.create({
    data: {
      name: "HANDLER",
      permissions: {
        connect: [
          { name: "CREATE_TICKET" },
          { name: "ASSIGN_TICKET" },
        ]}
      }
    });

  const userRole = await db.role.create({
    data: {
      name: "USER"
    }
  });


  const users = [
    {
      email: "admin@example.com",
      name: "Admin",
      password: "StrongP@ssw0rd123!",
    },
    {
      email: "handler@example.com",
      name: "Handler",
      password: "StrongP@ssw0rd123!",
    },
    {
      email: "user@example.com",
      name: "Regular User",
      password: "StrongP@ssw0rd123!",
    },
  ];


  for (const user of users) {
    const created = await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });

    // await db.user.update({
    //   where: { id: created.user.id },
    //   data: {
    //     roleId: user.roleId
    //    },
    // });
 }

  console.log("✅ Seed klar!");
}

main()
  .catch(console.error)
  .finally(async () => db.$disconnect());

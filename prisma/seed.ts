import { auth } from "~/server/better-auth";
import { db } from "~/server/db";

async function main() {
  await db.permission.createMany({
    data: [
      { name: "CREATE_TICKET" },
      { name: "ASSIGN_TICKET" },
      { name: "DELETE_TICKET" },
      { name: "MANAGE_USERS" },
    ],
  });

  const adminRole = await db.role.create({
    data: {
      name: "ADMIN",
      permissions: {
        connect: [{ name: "MANAGE_USERS" }, { name: "DELETE_TICKET" }],
      },
    },
  });

  const handlerRole = await db.role.create({
    data: {
      name: "HANDLER",
      permissions: {
        connect: [{ name: "CREATE_TICKET" }, { name: "ASSIGN_TICKET" }],
      },
    },
  });

  const userRole = await db.role.create({
    data: {
      name: "USER",
    },
  });

  const userOne = {
    email: "admin@example.com",
    name: "Admin",
    password: "StrongP@ssw0rd123!",
    role: adminRole.name,
  };

  const userTwo = {
    email: "handler@example.com",
    name: "Handler",
    password: "StrongP@ssw0rd123!",
    role: handlerRole.name,
  };

  const userThree = {
    email: "user@example.com",
    name: "Regular User",
    password: "StrongP@ssw0rd123!",
    role: userRole.name,
  };

  // const users = [
  //   {
  //     email: "admin@example.com",
  //     name: "Admin",
  //     password: "StrongP@ssw0rd123!",
  //     role: adminRole.name,
  //   },
  //   {
  //     email: "handler@example.com",
  //     name: "Handler",
  //     password: "StrongP@ssw0rd123!",
  //     role: handlerRole.name,
  //   },
  //   {
  //     email: "user@example.com",
  //     name: "Regular User",
  //     password: "StrongP@ssw0rd123!",
  //     role: userRole.name,
  //   },
  // ];

  const createdUserOne = await auth.api.signUpEmail({
    body: {
      email: userOne.email,
      password: userOne.password,
      name: userOne.name,
    },
  });

  await db.user.update({
    where: { id: createdUserOne.user.id },
    data: {
      role: {
        connect: { name: "ADMIN" },
      },
    },
  });

  const createdUserTwo = await auth.api.signUpEmail({
    body: {
      email: userTwo.email,
      password: userTwo.password,
      name: userTwo.name,
    },
  });

  await db.user.update({
    where: { id: createdUserTwo.user.id },
    data: {
      role: {
        connect: { name: "HANDLER" },
      },
    },
  });

  const createdUserThree = await auth.api.signUpEmail({
    body: {
      email: userThree.email,
      password: userThree.password,
      name: userThree.name,
    },
  });

  await db.user.update({
    where: { id: createdUserThree.user.id },
    data: {
      role: {
        connect: {
          name: "USER",
        },
      },
    },
  });

  const existingBox = await db.suggestionBox.findFirst();
  if (!existingBox) {
    const box = await db.suggestionBox.create({});
    console.log("Created default SuggestionBox with id:", box.id);
  } else {
    console.log("SuggestionBox already exists with id:", existingBox.id);
  }

  // for (const user of users) {
  //   const created = await auth.api.signUpEmail({
  //     body: {
  //       email: user.email,
  //       password: user.password,
  //       name: user.name,
  //     },
  //   });

  // await db.user.update({
  //   where: { id: created.user.id },
  //   data: {
  //     role: {
  //       connect: { name: user.role }
  //    },
  //   }
  // });
  //}

  console.log("✅ Seed klar!");
}

main()
  .catch(console.error)
  .finally(async () => db.$disconnect());

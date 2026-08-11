import { auth } from "~/server/better-auth";
import { db } from "~/server/db";
import { seedNews } from "./seeds/seedNews";
import { seedSuggestions } from "./seeds/seedSuggestions";
import { seedQuestions } from "./seeds/seedQuestions";
import { seedResources } from "./seeds/seedResources";
import { seedTickets } from "./seeds/seedTickets";

async function main() {
  await db.user.deleteMany();
  await db.role.deleteMany();
  await db.permission.deleteMany();
  await db.question.deleteMany();
  await db.resource.deleteMany();
  await db.news.deleteMany();
  await db.suggestion.deleteMany();
  await db.conversation.deleteMany();
  await db.ticket.deleteMany();

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
    data: { name: "USER" },
  });

  const createdUserOne = await auth.api.signUpEmail({
    body: {
      email: "admin@example.com",
      password: "StrongP@ssw0rd123!",
      name: "Admin",
    },
  });

  console.log("✅ ADMIN SKAPAD:", createdUserOne.user);

  await db.user.update({
    where: { id: createdUserOne.user.id },
    data: { role: { connect: { name: "ADMIN" } } },
  });

  console.log("✅ Admin skapad:", createdUserOne.user.email);

  const createdUserTwo = await auth.api.signUpEmail({
    body: {
      email: "handler@example.com",
      password: "StrongP@ssw0rd123!",
      name: "Handler",
    },
  });

  await db.user.update({
    where: { id: createdUserTwo.user.id },
    data: { role: { connect: { name: "HANDLER" } } },
  });

  const createdUserThree = await auth.api.signUpEmail({
    body: {
      email: "user@example.com",
      password: "StrongP@ssw0rd123!",
      name: "User",
    },
  });

  await db.user.update({
    where: { id: createdUserThree.user.id },
    data: { role: { connect: { name: "USER" } } },
  });

  const existingBox = await db.suggestionBox.findFirst();
  if (!existingBox) {
    await db.suggestionBox.create({});
  }

  const checkAdmin = await db.user.findUnique({
    where: {
      email: "admin@example.com",
    },
  });

  console.log("🔎 ADMIN FÖRE SEEDS:", checkAdmin);

  await seedNews();
  await seedSuggestions();
  await seedQuestions();
  await seedResources();
  await seedTickets();

  console.log("✅ Seed klar!");
}

main()
  .catch(console.error)
  .finally(async () => db.$disconnect());

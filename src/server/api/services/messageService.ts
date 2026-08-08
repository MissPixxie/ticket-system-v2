import { PrismaClient, MessageType } from "@prisma/client";

export const messageService = {
  async createMessage(
    db: PrismaClient,
    {
      conversationId,
      senderId,
      content,
      type = MessageType.USER_MESSAGE,
    }: {
      conversationId: string;
      senderId: string;
      content: string;
      type?: MessageType;
    },
  ) {
    return db.$transaction(async (tx) => {
      const participant = await tx.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: senderId,
          },
        },
      });

      if (!participant) {
        await tx.conversationParticipant.create({
          data: {
            conversationId,
            userId: senderId,
          },
        });
      }

      await tx.conversationParticipant.updateMany({
        where: {
          conversationId,
        },
        data: {
          hiddenAt: null,
        },
      });

      const message = await tx.message.create({
        data: {
          conversationId,
          senderId,
          content,
          type,
        },
        include: {
          sender: true,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {},
      });

      return message;
    });
  },
};

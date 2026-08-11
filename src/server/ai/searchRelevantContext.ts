import { db } from "~/server/db";
import { createEmbedding } from "./createEmbedding";
import { findMostSimilar } from "./embeddingSimilarity";

export async function searchRelevantContext(text: string, limit = 3) {
  const searchEmbedding = await createEmbedding(text);

  const [tickets, questions, resources, news, suggestions] = await Promise.all([
    db.ticket.findMany({
      where: {
        embedding: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        issue: true,
        department: true,
        priority: true,
        status: true,
        embedding: true,
      },
    }),

    db.question.findMany({
      where: {
        embedding: {
          not: null,
        },
      },
      select: {
        id: true,
        question: true,
        embedding: true,
      },
    }),

    db.resource.findMany({
      where: {
        embedding: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        category: true,
        embedding: true,
      },
    }),

    db.news.findMany({
      where: {
        embedding: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        embedding: true,
      },
    }),

    db.suggestion.findMany({
      where: {
        embedding: {
          not: null,
        },
      },
      select: {
        id: true,
        content: true,
        status: true,
        embedding: true,
      },
    }),
  ]);

  const relevantTickets = findMostSimilar(searchEmbedding, tickets, limit);

  const relevantQuestions = findMostSimilar(searchEmbedding, questions, limit);

  const relevantResources = findMostSimilar(searchEmbedding, resources, limit);

  const relevantNews = findMostSimilar(searchEmbedding, news, limit);

  const relevantSuggestions = findMostSimilar(
    searchEmbedding,
    suggestions,
    limit,
  );

  return {
    tickets: relevantTickets,
    questions: relevantQuestions,
    resources: relevantResources,
    news: relevantNews,
    suggestions: relevantSuggestions,
  };
}

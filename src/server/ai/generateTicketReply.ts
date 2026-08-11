import { openai } from "./aiClient";
import { searchRelevantContext } from "./searchRelevantContext";

interface GenerateTicketReplyParams {
  title: string;
  issue: string;
  messages: {
    senderName: string;
    content: string;
  }[];
}

export async function generateTicketReply({
  title,
  issue,
  messages,
}: GenerateTicketReplyParams) {
  const conversationText =
    messages.length > 0
      ? messages
          .map((message) => `${message.senderName}: ${message.content}`)
          .join("\n")
      : "Ingen konversation ännu.";

  const searchText = `
Ticket:
${title}

Problem:
${issue}

Konversation:
${conversationText}
`;

  const context = await searchRelevantContext(searchText, 3);

  const relevantTickets = context.tickets
    .map(
      (ticket) => `
TICKET
Titel: ${ticket.title}
Problem: ${ticket.issue}
Avdelning: ${ticket.department}
Prioritet: ${ticket.priority}
Likhet: ${ticket.similarity.toFixed(3)}
`,
    )
    .join("\n");

  const relevantQuestions = context.questions
    .map(
      (question) => `
QUESTION
${question.question}
Likhet: ${question.similarity.toFixed(3)}
`,
    )
    .join("\n");

  const relevantResources = context.resources
    .map(
      (resource) => `
RESOURCE
Titel: ${resource.title}
Beskrivning: ${resource.description}
URL: ${resource.url ?? "Ingen URL"}
Likhet: ${resource.similarity.toFixed(3)}
`,
    )
    .join("\n");

  const relevantNews = context.news
    .map(
      (news) => `
NEWS
Titel: ${news.title}
Innehåll: ${news.content}
Likhet: ${news.similarity.toFixed(3)}
`,
    )
    .join("\n");

  const relevantSuggestions = context.suggestions
    .map(
      (suggestion) => `
SUGGESTION
${suggestion.content}
Likhet: ${suggestion.similarity.toFixed(3)}
`,
    )
    .join("\n");

  const prompt = `
Du är en AI-assistent som hjälper en handler på ett internt ticketsystem.

Din uppgift är att föreslå ett professionellt och hjälpsamt svar på en ticket.

Använd:
1. Problembeskrivningen.
2. Den tidigare konversationen.
3. Relevant information från tidigare tickets, frågor, resurser, nyheter och förslag.

Hitta inte på information som inte finns i underlaget.
Om det saknas tillräcklig information ska svaret hellre be användaren om de uppgifter som behövs.

Svara på svenska.

=== AKTUELL TICKET ===

Titel:
${title}

Problem:
${issue}

=== KONVERSATION ===

${conversationText}

=== RELEVANTA TIDIGARE TICKETS ===

${relevantTickets || "Inga relevanta tickets hittades."}

=== RELEVANTA FRÅGOR ===

${relevantQuestions || "Inga relevanta frågor hittades."}

=== RELEVANTA RESURSER ===

${relevantResources || "Inga relevanta resurser hittades."}

=== RELEVANTA NYHETER ===

${relevantNews || "Inga relevanta nyheter hittades."}

=== RELEVANTA FÖRSLAG ===

${relevantSuggestions || "Inga relevanta förslag hittades."}

=== INSTRUKTION ===

Skriv endast det svar som handlern kan skicka till användaren.

Skriv inte:
- "Här är ett förslag"
- förklaringar om AI
- information om embeddings
- information om vilka källor du använde

Håll svaret tydligt, professionellt och relativt kort.
`;

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: prompt,
  });

  const reply = response.output_text?.trim();

  if (!reply) {
    throw new Error("AI kunde inte generera ett svar.");
  }

  return {
    reply,
    context,
  };
}

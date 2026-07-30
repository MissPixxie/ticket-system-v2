import { openai } from "./aiClient";

export async function generateNewsletter(text: string) {
  console.log("Calling OpenAI");

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: `
Du är en professionell kommunikatör på huvudkontoret.

Skapa ett nyhetsbrev baserat på följande konversation.

Regler:
- Skriv på svenska.
- Ta bort intern diskussion.
- Fokusera på viktiga nyheter, beslut och förändringar.
- Gör texten lämplig att skicka till anställda i butiker.
- Returnera endast JSON.

Format:
{
  "subject": "Rubrik",
  "body": "Nyhetsbrevets innehåll"
}

Konversation:

${text}
`,
    store: true,
  });

  const cleanJson = response.output_text
    .replace("```json", "")
    .replace("```", "")
    .trim();

  return JSON.parse(cleanJson);
}

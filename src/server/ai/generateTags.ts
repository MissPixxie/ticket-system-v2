import { openai } from "./aiClient";

export async function generateTags(text: string) {
  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: `
Returnera mellan 5 och 10 relevanta taggar för texten.


Regler:
- Svara endast med en JSON-array.
- Taggarna ska vara på svenska.
- Anpassa mängden taggar efter innehållets omfattning

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

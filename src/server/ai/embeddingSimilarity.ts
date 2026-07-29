/**
 * Jämför två embeddings och returnerar hur lika de är.
 *
 * Returnerar ett värde mellan -1 och 1:
 *  1   = identiska
 *  0   = ingen likhet
 * -1   = helt motsatta (väldigt ovanligt för embeddings)
 */
export function cosineSimilarity(a: number[], b: number[]) {
  // Embeddings måste ha samma antal dimensioner.
  // Om de inte har det har något gått fel.
  if (a.length !== b.length) {
    throw new Error("Embeddings måste ha samma längd");
  }

  // Variabler som används för att beräkna cosine similarity.
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // Loopa igenom varje dimension i embeddingsen.
  for (let i = 0; i < a.length; i++) {
    // ?? 0 är en extra säkerhet om någon position skulle vara undefined.
    const valueA = a[i] ?? 0;
    const valueB = b[i] ?? 0;

    // Skalärprodukten (dot product).
    // Blir större ju mer embeddings pekar åt samma håll.
    dotProduct += valueA * valueB;

    // Beräkna längden (magnituden) för respektive embedding.
    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  }

  // Skydd mot division med 0.
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // Själva cosine similarity-formeln.
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * Tar en embedding från användarens sökning och en lista med objekt
 * som redan har embeddings sparade i databasen.
 *
 * Returnerar de objekt som är mest lika sökningen.
 */
export function findMostSimilar<T extends { embedding: string | null }>(
  searchEmbedding: number[],
  items: T[],
  limit = 5,
) {
  return (
    items
      .map((item) => ({
        // Behåll all originaldata.
        ...item,

        // Lägg till ett similarity-värde.
        // Embeddingen i databasen är sparad som JSON-sträng,
        // därför måste den först göras om till en number[].
        similarity: cosineSimilarity(
          searchEmbedding,
          JSON.parse(item.embedding!),
        ),
      }))

      // Sortera så den mest lika kommer först.
      .sort((a, b) => b.similarity - a.similarity)

      // Returnera bara de X mest lika objekten.
      .slice(0, limit)
  );
}

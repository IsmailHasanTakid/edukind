# Ask AI — Islamic Knowledge Assistant

Route: `/deen-islam/ask-ai`

## How it works

1. The browser sends the current question and a short validated conversation
   history to `/deen-islam/ask-ai/api/ask`.
2. The server extracts reviewable retrieval terms from the question.
3. Quran evidence is searched through the existing AlQuran Cloud integration.
   The exact Arabic ayah and the Bengali/English editions are fetched for each
   selected result.
4. Hadith evidence is searched in the existing local dataset at
   `data/hadith-search-index.json`. The server stores the exact record, its
   collection, number, narrator, and source-provided grade.
5. Only those retrieved records are supplied to Groq as evidence. The model
   must return source IDs, not source metadata.
6. The server maps valid returned IDs back to its own retrieved records, rejects
   unknown IDs, and returns the verified source cards with the answer.

The model never supplies the Arabic text, translation, collection name, hadith
number, grade, or link that is displayed as a verified source.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | Server-only Groq credential. Never prefix with `NEXT_PUBLIC_`. |

Quran content uses the existing AlQuran Cloud endpoint and needs no API key.
Hadith search uses the project's local dataset and needs no API key.

If `GROQ_API_KEY` is missing, the page shows a configuration warning and the API
returns a clear `503 AI_NOT_CONFIGURED` response. It never falls back to
fabricated citations.

## Source limitations

- The Hadith dataset is treated as the source of its translations, narrator
  names, and grades. The app does not independently re-grade hadiths.
- Keyword retrieval can miss relevant evidence, and matching a keyword does not
  prove that a source answers the question. The interface distinguishes
  retrieved evidence from the AI's explanatory wording and reports gaps.
- The assistant does not hear or certify recitation and does not issue fatwas.
- Conversation state is kept in the page only. This feature does not create
  accounts or store conversations on the server.

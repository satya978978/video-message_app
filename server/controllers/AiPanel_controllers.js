import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
dotenv.config();


export const AI_questions = async (req, res) => {
  try {
const cohere = new CohereClient({
  apiKey: process.env.COHERE_API_KEY,
});

    const { jobDescription, selectedType } = req.body;

   const prompt = `You are an AI that generates interview questions. Based on the following job description: "${jobDescription}", generate exactly 4 "${selectedType}" interview questions in valid JSON format.
Respond with ONLY valid JSON — do not include any markdown formatting, code block markers, backticks, or explanations.
The response must be a pure JSON array of objects, like:
[
  {
    "question": "...",
    "category": "..."
  },
  ...
]
`


    const response = await cohere.generate({
      model: "command",      
      prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    const output = response.generations[0].text.trim();
    console.log("Generated questions:\n", output);

    res.send(output);

  } catch (err) {
    console.error("Cohere error:", err);
    res.status(500).send("Error generating questions");
  }
};

import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/generate-description", async (req, res) => {
  try {
    const { productName, keywords } = req.body;

    if (!productName) {
      return res.status(400).json({
        error: "productName is required",
      });
    }

    const prompt = `
Celebrate. Connect. Play.

Product Name: ${productName}
Keywords: ${keywords || ""}

Maximum 20 words.
No headings.
No bullet points.
No explanations.
Return only the description.
`;


    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.SANDBOX_GEMINI_DUKA_AI_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({
        error: "Failed to generate description",
      });
    }

    res.status(200).json({
      success: true,
      productName,
      description: generatedText,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI service unavailable",
    });
  }
});


//Reusable function for payment success messages

export async function generateThankYou(customerName, amount) {
  const prompt = `
Generate a friendly thank-you message.

Customer Name: ${customerName}
Amount Paid: KES ${amount}

Requirements:
- Maximum 2 sentences
- Friendly and professional
- Return only the message
`;

  return await callGemini(prompt);
}

export default router;
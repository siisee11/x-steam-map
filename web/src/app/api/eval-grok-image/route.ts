import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from 'fs';

export async function POST(req: Request) {
  const { imagePath, text } = await req.json();
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found');
    }
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    });
    let imageBase64 = '';
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBase64 = imageBuffer.toString('base64');
      const completion = await openai.chat.completions.create({
        model: "grok-vision-preview",
        messages: [
          { role: "system", content: "You are Grok, a visual AI assistant. Evaluate the text based on the following 8 factors, scoring each from 1 to 5: 1. Sentiment (5 for positive, 3 for neutral, 1 for negative) 2. Aggression 3. Urgency (higher scores indicate more urgency) 4. Virality (higher scores indicate more potential for virality) 5. Engagement 6. Human Impact (higher scores indicate greater impact on humans) 7. Economic Impact 8. Environmental Impact. Provide your answers as eight natural number scores from 1 to 5, separated by spaces. For example, you might respond with: 5 4 1 2 3 2 3 2." },
          {
            role: "user",
            content: [
              { type: "text", text }, 
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ],
          },
        ],
      });
      return NextResponse.json(completion.choices[0].message);
    } else {
      const completion = await openai.chat.completions.create({
        model: "grok-2-mini",
        messages: [
          { role: "system", content: "You are Grok, a text AI assistant. Evaluate the text based on the following 8 factors, scoring each from 1 to 5: 1. Sentiment (5 for positive, 3 for neutral, 1 for negative) 2. Aggression 3. Urgency (higher scores indicate more urgency) 4. Virality (higher scores indicate more potential for virality) 5. Engagement 6. Human Impact (higher scores indicate greater impact on humans) 7. Economic Impact 8. Environmental Impact. Provide your answers as eight natural number scores from 1 to 5, separated by spaces. For example, you might respond with: 5 4 1 2 3 2 3 2." },
          {
            role: "user",
            content: text
          },
        ],
      });
      return NextResponse.json(completion.choices[0].message);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}

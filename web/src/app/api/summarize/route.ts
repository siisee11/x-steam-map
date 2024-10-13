import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { text } = await req.json();
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found');
    }
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    });
    const completion = await openai.chat.completions.create({
      model: "grok-2-mini",
      messages: [
        { role: "system", content: "You are Grok, a text AI assistant to make script for the CNN broadcaster. Pick the striking events and summarize the texts in one line."},
        {
          role: "user",
          content: text
        },
      ],
    });
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}

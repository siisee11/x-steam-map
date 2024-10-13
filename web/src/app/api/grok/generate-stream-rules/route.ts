import { NextResponse } from "next/server";
import { promptToRule } from "../../../../../lib/data/prompt-to-rule";

export async function POST(req: Request) {
  const { prompt, temperature = 0.7 } = await req.json();

  const newPrompt = promptToRule(prompt);

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-preview",
        messages: [{ role: "user", content: newPrompt }],
        temperature: temperature,
        // response_format: { type: "json_object" }, // Enable JSON output mode
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const completion = await response.json();
    const markdownText = completion.choices[0].message.content;
    const jsonMatch = markdownText.match(/```json([^```]+)```/);

    if (jsonMatch) {
      const jsonString = jsonMatch[1].trim(); // Extract and trim the JSON string

      try {
        // Step 2: Parse the JSON string
        const parsedData = JSON.parse(jsonString);
        return NextResponse.json(parsedData);
      } catch (error) {
        console.error("Invalid JSON:", error);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 500 });
      }
    } else {
      const parsedData = JSON.parse(markdownText);
      return NextResponse.json(parsedData);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}

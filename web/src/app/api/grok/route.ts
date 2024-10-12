import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, temperature = 0.7 } = await req.json();

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const completion = await response.json();
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}

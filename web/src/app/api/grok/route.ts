import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  const {
    prompt,
    temperature = 0.7,
    modelName = "grok-preview",
    image,
  } = await req.json();

  const usImage = "/us_map.jpg";

  try {
    // Read the image file
    const imagePath = path.join(process.cwd(), "public", usImage);
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    const messages = image
      ? [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "text", text: "Here is the map for US" },
              { type: "image_url", image_url: { url: dataUrl } },
              {
                type: "text",
                text: "Here are several colored dots that represent events on the map. Please describe the events and their locations.",
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ]
      : [{ role: "user", content: prompt }];
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
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

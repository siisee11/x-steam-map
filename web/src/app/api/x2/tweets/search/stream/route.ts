import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

let activeStream: AbortController | null = null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "stop" && activeStream) {
    activeStream.abort();
    activeStream = null;
    return NextResponse.json({ message: "Stream stopped" });
  }

  // Set up SSE
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Connect to stream and handle incoming tweets
  activeStream = new AbortController();
  connectToStream(writer, encoder, activeStream.signal);

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function connectToStream(
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  signal: AbortSignal
) {
  try {
    const response = await axios.get(
      "https://api.x.com/2/tweets/search/stream",
      {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        responseType: "stream",
        signal,
      }
    );

    response.data.on("data", (chunk: Buffer) => {
      try {
        const jsonData = JSON.parse(chunk.toString());
        console.log("stream", jsonData);
        // Ensure we're sending data in the correct SSE format
        writer.write(encoder.encode(`data: ${JSON.stringify(jsonData)}\n\n`));
      } catch (error) {
        console.error("Error parsing chunk:", error);
      }
    });

    response.data.on("end", () => {
      console.log("Stream ended");
      writer.close();
    });

    signal.addEventListener("abort", () => {
      response.data.destroy();
      writer.close();
    });
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.error("Error connecting to stream:", error);
    }
    writer.close();
  }
}

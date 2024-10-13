import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { StreamTweet } from "../../../../../../../lib/types/xapi";

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
      "https://api.x.com/2/tweets/search/stream?tweet.fields=geo",
      {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        responseType: "stream",
        signal,
      }
    );

    response.data.on("data", async (chunk: Buffer) => {
      try {
        const chunkString = chunk.toString();
        if (chunkString.trim().length === 0) {
          return;
        }
        const streamTweet: StreamTweet = JSON.parse(chunkString);
        const matchingRules = streamTweet.matching_rules;
        console.log("matchingRules", matchingRules);

        // const tweetId = streamTweet.data.id;
        // const tweetRes = await axios.get(
        //   `https://api.twitter.com/2/tweets?ids=${tweetId}&tweet.fields=created_at,geo`,
        //   {
        //     headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        //   }
        // );
        // const tweet = tweetRes.data.data[0];
        // streamTweet.data = tweet;
        writer.write(
          encoder.encode(`data: ${JSON.stringify(streamTweet)}\n\n`)
        );
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

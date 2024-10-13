import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  StreamTweet,
  Tweet,
  TweetEvaluation,
} from "../../../../../../../lib/types/xapi";

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
      "https://api.x.com/2/tweets/search/stream?tweet.fields=geo&place.fields=geo",
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
        const tweet = streamTweet.data;

        const evaluation = await evaluateTweet(tweet);
        console.log("evaluation", evaluation);

        console.log("streamTweet", streamTweet);
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

const evaluateTweet = async (tweet: Tweet) => {
  const prompt = `You are Grok, a text AI assistant. 
  Evaluate the text based on the following 8 factors, scoring each from 1 to 5: 
  1. Sentiment (5 for positive, 3 for neutral, 1 for negative) 
  2. Aggression 
  3. Urgency (higher scores indicate more urgency) 
  4. Virality (higher scores indicate more potential for virality) 
  5. Engagement 
  6. Human Impact (higher scores indicate greater impact on humans) 
  7. Economic Impact 
  8. Environmental Impact. 
  Provide your answers as JSON.
  response example:
  {
      'sentiment': 5,
      'aggression': 4,
      'urgency': 1,
      'virality': 2,
      'engagement': 3,
      'human_impact': 2,
      'economic_impact': 3,
      'environmental_impact': 2
  }
      
  tweet text:
  ${tweet.text}

  Don't include any other text than the JSON object starting with { and ending with }.
  `;
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
        temperature: 0.7,
        // response_format: { type: "json_object" }, // Enable JSON output mode (response format is not supported??)
      }),
    });

    if (!response.ok) {
      console.error("Error evaluating tweet:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const completion = await response.json();
    const jsonString = completion.choices[0].message.content;
    const evaluation = JSON.parse(jsonString) as TweetEvaluation;
    return evaluation;
  } catch (error) {
    console.error("Error evaluating tweet:", error);
    return null;
  }
};

import { NextResponse } from "next/server";
import axios from "axios";

const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

if (!BEARER_TOKEN) {
  throw new Error("X_BEARER_TOKEN is not set in the environment variables");
}

export async function GET() {
  try {
    const response = await axios.get(
      "https://api.x.com/2/tweets/search/stream/rules",
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(
      "https://api.x.com/2/tweets/search/stream/rules",
      body,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error adding rules:", error);
    return NextResponse.json({ error: "Failed to add rules" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(
      "https://api.x.com/2/tweets/search/stream/rules",
      body,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error deleting rules:", error);
    return NextResponse.json(
      { error: "Failed to delete rules" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "events.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Parse the CSV content using PapaParse
    const { data, errors } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length) {
      console.error("Error parsing CSV file:", errors);
      return NextResponse.json(
        { error: "Error parsing CSV file" },
        { status: 500 }
      );
    }

    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

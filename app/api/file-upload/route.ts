export const runtime = "edge";

import { v4 as uuidv4 } from "uuid"; // To generate a unique filename
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();
  const uploadedFiles = formData.getAll("file");
  const results: { parsedText?: string; error?: string }[] = [];

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return new NextResponse("No files found.", { status: 400 });
  }

  // Send each file to api
  for (const File of uploadedFiles) {
    const fileName: string = uuidv4();
    const fileData = await (File instanceof Blob
      ? File.arrayBuffer()
      : Promise.reject("Invalid file"));
    // Convert the file to base64
    const base64Data = Buffer.from(fileData).toString("base64");

    const fileResult = await fetch(
      "https://sblumenf-pdf-text-extractor.hf.space/run/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              name: fileName,
              data: `data:@file/octet-stream;base64,${base64Data}`,
            },
          ],
        }),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        let data = r.data;
        return data;
      });
    results.push(fileResult);
  }
  return NextResponse.json(results, { status: 200 });
}

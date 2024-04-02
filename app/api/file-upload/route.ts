import { v4 as uuidv4 } from "uuid"; // To generate a unique filename

export async function POST(req: Request) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("file");
  const results: { parsedText?: string, error?: string }[] = [];

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return new Response("No files found.", { status: 400 });
  }

  // Send each file to api
  for (const File of uploadedFiles) {
    const fileName: string = uuidv4();
    const fileData = await (File instanceof Blob ? File.arrayBuffer() : Promise.reject("Invalid file"));
    // Convert the file to base64
    const base64Data = Buffer.from(fileData).toString('base64');
    
    const fileResult = await fetch("https://sblumenf-pdf-text-extractor.hf.space/run/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
        { name: fileName, data: `data:@file/octet-stream;base64,${base64Data}` },
        ]
      })})
      .then(r => r.json())
      .then(r => {
        let data = r.data;
        return data;
    })
    results.push(fileResult);
  }

    // await Promise.all(uploadedFiles.map(async (File) => {
    //   if (File instanceof File) {
    //     const fileName: string = uuidv4();
    //     const tempFilePath = `/tmp/${fileName}.pdf`;
    //     const fileBuffer = Buffer.from(await File.arrayBuffer());
    //     await fs.writeFile(tempFilePath, fileBuffer);

    //     const pdfParser = new (PDFParser as any)(null, 1);

    //     try {
    //       const parsedText: any = await new Promise((resolve, reject) => {
    //         pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    //         pdfParser.on("pdfParser_dataReady", () => {
    //           const parsedText = (pdfParser as any).getRawTextContent();
    //           resolve(parsedText);
    //         });
    //         pdfParser.loadPDF(tempFilePath);
    //       });

    //       if (parsedText === null) {
    //         results.push({ error: "Uploaded file is not in the expected format." });
    //       } else {
    //         results.push({ parsedText });
    //       }
    //     } catch (error) {
    //       results.push({ error: `Error parsing PDF: ${error}` });
    //     } finally {
    //       await fs.unlink(tempFilePath); // Delete the temporary file
    //     }
    //   } else {
    //     results.push({ error: "Uploaded file is not in the expected format." });
    //   }
    // }));

    return new Response(JSON.stringify(results), { status: 200 });
  }

import { promises as fs } from "fs"; // To save the file temporarily
import { v4 as uuidv4 } from "uuid"; // To generate a unique filename
import PDFParser from "pdf2json"; // To parse the pdf
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { chunk } from 'llm-chunk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ""
});

const index = pc.index("uploads")

export async function POST(req: Request) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("file");
  const parsedTexts: string[] = [];
  const fileCollectionName: string = uuidv4();

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return new Response("No files found.", { status: 400 });
  }
  for (const file of uploadedFiles) {
    if (file instanceof Blob) {
      // Generate a unique filename
      const fileName: string = uuidv4();
      // Convert the uploaded file into a temporary file
      const tempFilePath = `/tmp/${fileName}.pdf`;
      // Convert ArrayBuffer to Buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);
      // Save the buffer as a file
      // Parse the pdf using pdf2json. See pdf2json docs for more info.
      // The reason I am bypassing type checks is because
      // the default type definitions for pdf2json in the npm install
      // do not allow for any constructor arguments.
      // You can either modify the type definitions or bypass the type checks.
      // I chose to bypass the type checks.
      const pdfParser = new (PDFParser as any)(null, 1);
      // See pdf2json docs for more info on how the below works.
      try {
        const parsedText: any = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));        
          pdfParser.on("pdfParser_dataReady", () => {
            const parsedText = (pdfParser as any).getRawTextContent();
            resolve(parsedText);
          });
          pdfParser.loadPDF(tempFilePath);
        });
        parsedTexts.push(parsedText);
      } catch (error) {
        return new Response(JSON.stringify({message: `Error parsing PDF: ${error}`}), { status: 500 });
      }
    } else {
      return new Response("Uploaded file is not in the expected format.", { status: 400 });
    }
  }
  const combinedParsedText = parsedTexts.join();

  // Split up combinedParsedText into chunks of around 500 words based on paragraph breaks
  const chunks = chunk(combinedParsedText, {
    minLength: 200,          // number of minimum characters into chunk
    maxLength: 1000,       // number of maximum characters into chunk
    splitter: "paragraph", // paragraph | sentence
    overlap: 100,            // number of overlap chracters
    delimiters: "\n"         // regex for base split method
  });
  
  // Get vectors for each chunk and add to pinecone index
  for (const chunk of chunks) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
      encoding_format: "float",
    });
    // console.log("embedding:", embedding.data[0].embedding);
    const vectors = embedding.data[0].embedding;
    // console.log("vectors:", vectors.length);
    await index.namespace(fileCollectionName).upsert([
      {
        id: uuidv4(), 
        values: vectors,
        metadata: { text: chunk }
      },
    ]);
  }

  return new Response(JSON.stringify({fileCollectionName: fileCollectionName}), { status: 200 });
}
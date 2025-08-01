import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);
  return data.text; // Plain text from PDF
}

export function parseCertificateData(text: string) {
  const fullName = text.match(/Full Name:\s*(.*)/)?.[1];
  const degree = text.match(/Degree:\s*(.*)/)?.[1];
  const field = text.match(/Field:\s*(.*)/)?.[1];
  const issuedAt = text.match(/Issued At:\s*(.*)/)?.[1];

  return { fullName, degree, field, issuedAt };
}

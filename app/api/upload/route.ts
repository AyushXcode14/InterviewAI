import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { v4 as uuidv4} from 'uuid';
import PDFParser from 'pdf2json';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll('filepond');
    let fileName = '';
    let parsedText = '';

    console.log('Uploaded files:', uploadedFiles);

    if (uploadedFiles && uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles.find(f => typeof f === 'object' && f instanceof File) || uploadedFiles[0];

      console.log('Uploaded file type:', typeof uploadedFile);
      console.log('Uploaded file instance:', uploadedFile);

      if (uploadedFile instanceof File) {
        console.log('Uploaded file is a File instance:', uploadedFile.name);

        fileName = uuidv4();
        const os = require('os');
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `${fileName}.pdf`);

        await fs.mkdir(tempDir, { recursive: true });

        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        await fs.writeFile(tempFilePath, fileBuffer);

        parsedText = await new Promise<string>((resolve, reject) => {
          const pdfParser = new (PDFParser as any)(null, 1);

          pdfParser.on('pdfParser_dataError', (errData: any) => {
            console.error('pdf2json error:', errData.parserError);
            reject(errData.parserError);
          });

          pdfParser.on('pdfParser_dataReady', () => {
            resolve((pdfParser as any).getRawTextContent());
          });

          pdfParser.loadPDF(tempFilePath);
        });
      } else {
        throw new Error('Uploaded file is not a valid File object. It is a ' + typeof uploadedFile);
      }
    } else {
      throw new Error('No files found in formData under "filepond".');
    }

    console.log('Parsed text length:', parsedText.length);

    return new NextResponse(parsedText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'FileName': fileName,
      },
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return new NextResponse(error.message || String(error), {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

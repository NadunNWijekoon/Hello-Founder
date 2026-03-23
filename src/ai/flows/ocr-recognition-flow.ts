'use server';
/**
 * @fileOverview A Genkit flow for performing Optical Character Recognition (OCR) on a live camera feed image.
 *
 * - recognizeTextOCR - A function that handles the OCR process.
 * - OCRRecognitionInput - The input type for the recognizeTextOCR function.
 * - OCRRecognitionOutput - The return type for the recognizeTextOCR function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema: A single image as a data URI
const OCRRecognitionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo or frame from a camera feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OCRRecognitionInput = z.infer<typeof OCRRecognitionInputSchema>;

// Output Schema: An array of recognized text strings
const OCRRecognitionOutputSchema = z.object({
  recognizedTexts: z.array(z.string()).describe('An array of all distinct text strings recognized in the image.'),
});
export type OCRRecognitionOutput = z.infer<typeof OCRRecognitionOutputSchema>;

export async function recognizeTextOCR(input: OCRRecognitionInput): Promise<OCRRecognitionOutput> {
  return ocrRecognitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrRecognitionPrompt',
  input: { schema: OCRRecognitionInputSchema },
  output: { schema: OCRRecognitionOutputSchema },
  prompt: `You are an expert OCR system. Your task is to accurately extract all distinct readable text from the provided image.\n\nStrictly respond with a JSON object matching the following schema:\n\n```json\n{{{_output_schema}}}\n```\n\nHere is the image to process:\n{{media url=imageDataUri}}`
});

const ocrRecognitionFlow = ai.defineFlow(
  {
    name: 'ocrRecognitionFlow',
    inputSchema: OCRRecognitionInputSchema,
    outputSchema: OCRRecognitionOutputSchema,
    // Model explicitly set here to a multimodal vision model capable of OCR.
    // The global default model in genkit.ts might not be suitable for vision tasks.
    // Gemini 1.5 Pro is a good choice for OCR.
    defaultModel: 'googleai/gemini-1.5-pro',
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('OCR recognition failed: no output from model.');
    }
    return output;
  }
);
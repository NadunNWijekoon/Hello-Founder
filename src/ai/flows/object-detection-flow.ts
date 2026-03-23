'use server';
/**
 * @fileOverview This file defines a Genkit flow for real-time object detection
 * from a camera feed.
 *
 * - detectObjects - A function that handles the object detection process.
 * - ObjectDetectionInput - The input type for the detectObjects function.
 * - ObjectDetectionOutput - The return type for the detectObjects function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ObjectDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the camera feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ObjectDetectionInput = z.infer<typeof ObjectDetectionInputSchema>;

const BoundingBoxSchema = z.object({
  x: z.number().describe('The x-coordinate of the top-left corner of the bounding box, normalized to 0-1.'),
  y: z.number().describe('The y-coordinate of the top-left corner of the bounding box, normalized to 0-1.'),
  width: z.number().describe('The width of the bounding box, normalized to 0-1.'),
  height: z.number().describe('The height of the bounding box, normalized to 0-1.'),
});

const DetectedObjectSchema = z.object({
  label: z.string().describe('The name of the detected object (e.g., "person", "phone", "laptop").'),
  confidence: z.number().describe('The confidence percentage (0-100) that this is the detected object.'),
  boundingBox: BoundingBoxSchema.optional().describe('The bounding box of the detected object within the image.'),
});

const ObjectDetectionOutputSchema = z.object({
  detections: z.array(DetectedObjectSchema).describe('An array of detected objects with their labels, confidence, and optional bounding box.'),
});
export type ObjectDetectionOutput = z.infer<typeof ObjectDetectionOutputSchema>;

const objectDetectionPrompt = ai.definePrompt({
  name: 'objectDetectionPrompt',
  input: { schema: ObjectDetectionInputSchema },
  output: { schema: ObjectDetectionOutputSchema },
  prompt: `You are an expert object detection system. Your task is to analyze the provided image from a camera feed and identify common objects.\nFor each detected object, provide its label (e.g., "person", "phone", "laptop"), a confidence percentage (0-100), and optionally, its bounding box coordinates normalized to 0-1 (x, y, width, height).\nIf no objects are detected, return an empty array for 'detections'.\n\nImage: {{media url=photoDataUri}}`,
  config: {
    model: googleAI.model('gemini-1.5-flash-latest'),
    temperature: 0.1,
  },
});

const objectDetectionFlow = ai.defineFlow(
  {
    name: 'objectDetectionFlow',
    inputSchema: ObjectDetectionInputSchema,
    outputSchema: ObjectDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await objectDetectionPrompt(input);
    if (!output) {
      throw new Error('Object detection model returned no output or an invalid output.');
    }
    return output;
  }
);

export async function detectObjects(
  input: ObjectDetectionInput
): Promise<ObjectDetectionOutput> {
  return objectDetectionFlow(input);
}

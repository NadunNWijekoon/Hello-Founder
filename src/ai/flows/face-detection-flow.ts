'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting faces in an image.
 *
 * - detectFaces - A function that handles the face detection process.
 * - DetectFacesInput - The input type for the detectFaces function.
 * - DetectFacesOutput - The return type for the detectFaces function.
 *
 * NOTE: The project overview explicitly states that AI processing for "Hello Founder"
 * should run entirely on-device and offline using technologies like TensorFlow Lite.
 * This Genkit flow is provided as a conceptual representation of how such an AI task
 * *could* be defined using Genkit if it were a cloud-based operation.
 * The actual face detection logic for the mobile application is expected to be
 * implemented client-side using on-device AI models.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const DetectFacesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face or multiple faces, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectFacesInput = z.infer<typeof DetectFacesInputSchema>;

const BoundingBoxSchema = z.object({
  x: z.number().describe('The x-coordinate of the top-left corner of the bounding box.'),
  y: z.number().describe('The y-coordinate of the top-left corner of the bounding box.'),
  width: z.number().describe('The width of the bounding box.'),
  height: z.number().describe('The height of the bounding box.'),
  confidence: z.number().optional().describe('The confidence score of the detection, if available (0.0 to 1.0).'),
});

const DetectFacesOutputSchema = z.object({
  facesDetected: z.boolean().describe('True if one or more faces were detected, false otherwise.'),
  boundingBoxes: z.array(BoundingBoxSchema).describe('An array of bounding boxes for each detected face.'),
});
export type DetectFacesOutput = z.infer<typeof DetectFacesOutputSchema>;

export async function detectFaces(input: DetectFacesInput): Promise<DetectFacesOutput> {
  return detectFacesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFacesPrompt',
  input: {schema: DetectFacesInputSchema},
  output: {schema: DetectFacesOutputSchema},
  prompt: `Analyze the provided image and detect any human faces present.\n  \n  For each detected face, provide the bounding box coordinates (x, y, width, height) relative to the image.\n  If no faces are detected, set 'facesDetected' to false and provide an empty array for 'boundingBoxes'.\n  \n  Example output format:\n  {\n    "facesDetected": true,\n    "boundingBoxes": [\n      { "x": 100, "y": 50, "width": 80, "height": 100, "confidence": 0.95 },\n      { "x": 250, "y": 70, "width": 70, "height": 90, "confidence": 0.88 }\n    ]\n  }\n  \n  Image: {{media url=photoDataUri}}`,
});

const detectFacesFlow = ai.defineFlow(
  {
    name: 'detectFacesFlow',
    inputSchema: DetectFacesInputSchema,
    outputSchema: DetectFacesOutputSchema,
  },
  async input => {
    // NOTE: This flow uses a generative AI model to simulate face detection.
    // For the "Hello Founder" project, the actual face detection should occur
    // on-device using specialized, lightweight models (e.g., TensorFlow Lite)
    // to meet the offline and performance requirements.
    const {output} = await ai.generate({
      prompt: prompt.name,
      input: input,
      model: googleAI.model('gemini-2.5-flash-image'),
      config: {
        responseModalities: ['TEXT'],
      },
    });

    if (!output) {
      throw new Error('Failed to detect faces: No output from model.');
    }

    return output;
  }
);

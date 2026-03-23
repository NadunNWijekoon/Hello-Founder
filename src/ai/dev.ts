import { config } from 'dotenv';
config();

import '@/ai/flows/object-detection-flow.ts';
import '@/ai/flows/face-detection-flow.ts';
import '@/ai/flows/ocr-recognition-flow.ts';
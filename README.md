# Hello Founder

"Hello Founder" is a real-time intelligent camera assistant inspired by futuristic AI concepts like J.A.R.V.I.S. It leverages your device's camera and modern AI capabilities to analyze the world around you, providing a heads-up display (HUD) with information about detected objects, faces, and text.

## 🚀 Features

-   **Real-time Camera Feed**: Utilizes the device's camera to provide a live video stream.
-   **AI-Powered Analysis**:
    -   **Object Detection**: Identifies and labels common objects in the camera's view.
    -   **Face Detection**: Locates human faces.
    -   **Optical Character Recognition (OCR)**: Reads and extracts text from the environment.
-   **Futuristic HUD**: Overlays bounding boxes, labels, and other information directly onto the camera feed.
-   **Voice Feedback**: Announces detected objects for a hands-free experience.
-   **Customizable Settings**: An intuitive settings panel to toggle detections, adjust confidence thresholds, and switch themes.
-   **Modern, Responsive UI**: Built with a sleek, dark-mode-first design that adapts to different screen sizes.
-   **Splash Screen**: An animated boot-up sequence for a polished user experience.

## 🛠 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) for components.
-   **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) with Gemini models for vision and analysis.
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later recommended)
-   `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key. You can get one from [Google AI Studio](https://makersuite.google.com/).

    ```env
    GEMINI_API_KEY=your_google_ai_api_key
    ```

### Running the Application

1.  **Run the Genkit development server:**
    This runs the AI flows that the Next.js app will call.
    ```bash
    npm run genkit:dev
    ```

2.  **Run the Next.js development server:**
    In a separate terminal, run the main application.
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📁 Project Structure

-   `src/app/`: Main application code using the Next.js App Router.
    -   `page.tsx`: The entry point for the main page.
    -   `client-page.tsx`: The main client-side component that orchestrates the camera, AI processing, and UI.
    -   `globals.css`: Global styles and Tailwind CSS configuration.
-   `src/components/`: Reusable React components.
    -   `ui/`: Components from ShadCN UI.
    -   `camera-feed.tsx`: Manages camera access and frame capture.
    -   `hud-overlay.tsx`: Renders the heads-up display, including bounding boxes and status info.
    -   `settings-panel.tsx`: The slide-out panel for application settings.
-   `src/ai/`: Contains all Genkit-related code.
    -   `genkit.ts`: Genkit initialization and configuration.
    -   `flows/`: Defines the AI processing flows (e.g., `object-detection-flow.ts`).
-   `src/contexts/`: React context providers (e.g., `settings-context.tsx`).
-   `src/hooks/`: Custom React hooks (e.g., `use-speech.ts`).
-   `public/`: Static assets.

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Lints the codebase.
-   `npm run genkit:dev`: Starts the Genkit development server for your AI flows.
-   `npm run genkit:watch`: Starts Genkit in watch mode, automatically restarting on file changes.

## ⚙️ Configuration

The application can be configured in real-time through the **Settings Panel** (click the gear icon). You can adjust:

-   **Theme**: Switch between dark and light modes.
-   **Detection Toggles**: Enable or disable Object, Face, or Text detections.
-   **Voice Feedback**: Turn voice announcements on or off.
-   **Confidence Threshold**: Adjust the minimum confidence level required for an object to be displayed.

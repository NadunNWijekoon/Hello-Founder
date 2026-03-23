import ClientPage from "./client-page";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-background" />}>
      <ClientPage />
    </Suspense>
  );
}

"use client";

import { GeistSans } from "geist/font/sans";
import Header from "@/components/header";
import Button from "@/components/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        className={`${GeistSans.className} bg:white h-screen dark:bg-zinc-950`}
      >
        <Header />
        <div className="flex h-full flex-col items-center p-4">
          <div className="flex h-full max-w-56 flex-col justify-center gap-8 pb-12 text-center">
            <h2 className="text-xl font-medium text-zinc-950 dark:text-white">
              Something went wrong!
            </h2>
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}

"use client";

import { useState } from "react";

import SourceCard, {
  SourceCardProps,
} from "@/components/source-card/source-card";

export default function WebResultGroup({
  results,
}: {
  results: SourceCardProps[];
}) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.6}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            />
          </svg>
          <h3 className="text-base font-semibold">Sources</h3>
        </div>
        <div className="grid w-full grid-cols-1 flex-row gap-2 overflow-visible sm:grid-cols-3">
          {results?.length > 0 &&
            results
              .slice(0, showAll ? results.length : 2)
              .map((result, index) => (
                <SourceCard
                  key={index}
                  title={result.title}
                  description={result.description}
                  url={result.url}
                  date={result.date}
                  author={result.author}
                  imageURL={result.imageURL}
                />
              ))}
          {results.length > 2 && (
            <button
              className="flex min-w-0 flex-col justify-between gap-3 rounded-md border border-zinc-100 bg-zinc-50 p-2 text-sm font-semibold text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
              onClick={() => setShowAll(!showAll)}
            >
              <span className="flex w-full flex-row gap-2">
                {[...results.slice(2, 8)].map((result, index) => (
                  <img
                    key={index}
                    src={result.imageURL}
                    alt={result.title}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                ))}
              </span>
              Show {showAll ? "less" : `+${results.length - 2} more`}
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.6}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          <h3 className="text-base font-semibold">Answer</h3>
        </div>
      </div>
    </div>
  );
}

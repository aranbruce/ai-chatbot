"use client";

import { useState } from "react";

import SourceCard, {
  SourceCardProps,
} from "@/components/source-card/source-card";

export default function WebResultGroup({
  summary,
  results,
}: {
  summary: React.ReactNode;
  results: SourceCardProps[];
}) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-base font-semibold">Sources</h3>
        <div className="grid w-full grid-cols-1 flex-row gap-2 overflow-visible sm:grid-cols-3">
          {results
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

          <button
            className="flex min-w-0 flex-col justify-between gap-3 rounded-md border border-zinc-100 bg-zinc-50 p-2 text-sm font-semibold text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
            onClick={() => setShowAll(!showAll)}
          >
            {/* show the images of the other results */}
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
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-base font-semibold">Answer</h3>
        {summary}
      </div>
    </div>
  );
}

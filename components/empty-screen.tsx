"use client";

import { useEffect, useState } from "react";
import { useActions } from "ai/rsc";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Select from "./select";
import { SelectProps } from "./select";

interface EmptyScreenProps {
  handleExampleClick: (message: string) => void;
  SelectProps: SelectProps;
}

interface ExampleMessage {
  heading: string;
  subheading: string;
}

export default function EmptyScreen({
  handleExampleClick,
  SelectProps,
}: EmptyScreenProps) {
  const [examples, setExamples] = useState<ExampleMessage[]>([]);
  const [isExamplesLoaded, setIsExamplesLoaded] = useState(false);
  const { createExampleMessages } = useActions();

  useEffect(() => {
    async function fetchExamples() {
      const response = await createExampleMessages();
      const examples = response.examples;
      setExamples(examples);
      setIsExamplesLoaded(true);
    }
    if (!isExamplesLoaded) {
      fetchExamples();
    }
  }, []);

  return (
    <div className="flex h-full min-h-fit flex-col justify-between gap-1">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Select a model
        </p>
        <Select
          options={SelectProps.options}
          selectedValue={SelectProps.selectedValue}
          setSelectedValue={SelectProps.setSelectedValue}
        />
      </div>
      <div className="flex h-full flex-col content-center items-center justify-center gap-8 text-center">
        <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">
            Hi I'm Pal
          </h1>
          <p className="text-muted-foreground leading-normal text-zinc-500 dark:text-zinc-400">
            How can I help today?
          </p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {!isExamplesLoaded
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonTheme
                baseColor="#d4d4d8"
                highlightColor="#f4f4f5"
                key={index}
              >
                <div
                  className={`dark:border-700 flex cursor-pointer flex-col gap-1 rounded-xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition hover:bg-zinc-100 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-slate-950/20 active:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 hover:dark:border-zinc-700 hover:dark:bg-zinc-800 dark:focus-visible:border-zinc-800
            dark:focus-visible:ring-white/40 ${index > 1 && "hidden md:block"}`}
                >
                  <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    <Skeleton width={96} height={20} />
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    <Skeleton height={14} />
                    <Skeleton width={96} height={14} />
                  </div>
                </div>
              </SkeletonTheme>
            ))
          : examples.map((example: ExampleMessage, index: number) => (
              <button
                key={index}
                className={`dark:border-700 cursor-pointer rounded-xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition hover:bg-zinc-100 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-slate-950/20 active:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 hover:dark:border-zinc-700 hover:dark:bg-zinc-800 dark:focus-visible:border-zinc-800
            dark:focus-visible:ring-white/40 ${index > 1 && "hidden md:block"}`}
                onClick={() => handleExampleClick(example.subheading)}
              >
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {example.heading}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {example.subheading}
                </div>
              </button>
            ))}
      </div>
    </div>
  );
}

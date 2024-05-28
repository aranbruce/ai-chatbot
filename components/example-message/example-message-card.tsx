"use client";

import { useActions, useUIState } from "ai/rsc";
import { v4 as uuidv4 } from "uuid";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { ClientMessage } from "@/server/actions";

export interface ExampleMessageCardProps {
  index: number;
  heading?: string;
  subheading?: string;
  modelVariable?: string;
}

export default function ExampleMessageCard({
  index,
  heading,
  subheading,
  modelVariable,
}: ExampleMessageCardProps) {
  const { continueConversation } = useActions();
  const [, setMessages] = useUIState();

  async function sendMessage() {
    // Add user message to UI state
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: uuidv4(),
        display: <>{subheading}</>,
        role: "user",
      },
    ]);
    // Submit and get response message
    const response = await continueConversation(subheading, modelVariable);
    setMessages((messages: ClientMessage[]) => [...messages, response]);
  }

  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <button
        className={`dark:border-700 flex cursor-pointer flex-col content-stretch gap-1 rounded-xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition hover:bg-zinc-100 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-slate-950/20 active:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 hover:dark:border-zinc-700 hover:dark:bg-zinc-800 dark:focus-visible:border-zinc-800
            dark:focus-visible:ring-white/40 ${index > 1 && "hidden md:flex"}`}
        onClick={() => sendMessage()}
        disabled={!modelVariable || !subheading || !heading}
      >
        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          {heading || <Skeleton width={96} height={18} />}
        </div>
        <div className="w-full text-sm text-zinc-500 dark:text-zinc-400">
          {subheading || (
            <>
              <Skeleton height={14} />
              <Skeleton width={128} height={14} />
            </>
          )}
        </div>
      </button>
    </SkeletonTheme>
  );
}

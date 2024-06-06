import { ReactNode } from "react";
import MarkdownContainer from "./markdown";
import { useAIState } from "ai/rsc";
import { AIState } from "@/server/actions";
import Select from "./select";
import Image from "next/image";

interface MessageProps {
  id: string;
  role: string;
  content: string | ReactNode | undefined;
  model?: string;
}

const modelVariableOptions = [
  {
    value: "gpt-4o",
    label: "4o",
    provider: "openai",
  },
  {
    value: "gpt-4-turbo",
    label: "4 Turbo",
    provider: "openai",
  },
  {
    value: "gpt-3.5-turbo",
    label: "3.5 Turbo",
    provider: "openai",
  },
  {
    value: "gemini-1.5-pro-latest",
    label: "1.5 Pro",
    provider: "gemini",
  },
  {
    value: "gemini-1.5-flash-latest",
    label: "1.5 Flash",
    provider: "gemini",
  },
  {
    value: "mistral-large-latest",
    label: "Large",
    provider: "mistral",
  },
  {
    value: "claude-3-opus-20240229",
    label: "3 Opus",
    provider: "claude",
  },
  {
    value: "claude-3-sonnet-20240229",
    label: "3 Sonnet",
    provider: "claude",
  },
  {
    value: "claude-3-haiku-20240307",
    label: "3 Haiku",
    provider: "claude",
  },
];

export default function MessageCard({
  id,
  role,
  content,
  model,
}: MessageProps) {
  const [AIState, setAIState] = useAIState();

  const selectedModel = modelVariableOptions.find(
    (option) => option.value === model,
  );

  function setSelectedValue(value: string) {
    setAIState((AIState: AIState) => ({
      ...AIState,
      currentModelVariable: value,
    }));
  }

  return (
    <div
      key={id}
      className="flex  flex-row items-start gap-3 whitespace-pre-wrap"
    >
      <div className="flex flex-row items-center gap-4">
        {role !== "user" && (
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-50">
            <Image
              src={`/images/logos/${selectedModel?.provider}.svg`}
              alt={selectedModel?.label || "AI"}
              width={32}
              height={32}
            />
          </div>
        )}
      </div>
      <div
        className={`flex w-full max-w-full flex-col gap-1 ${role === "user" && "items-end"}`}
      >
        {role !== "user" && (
          <h5 className="text-md pt-1 font-semibold text-zinc-950 dark:text-zinc-300">
            {selectedModel?.label.toString()}
          </h5>
        )}
        <div
          className={`flex flex-col gap-4 text-zinc-950 dark:text-zinc-300 ${role === "user" && "w-auto rounded-xl bg-zinc-200/60 px-4 py-2 dark:bg-zinc-800"}`}
        >
          {typeof content === "string" ? (
            <MarkdownContainer children={content} />
          ) : (
            content
          )}
        </div>
        {role === "assistant" && (
          <Select
            variant="secondary"
            options={modelVariableOptions}
            selectedValue={AIState.currentModelVariable}
            setSelectedValue={setSelectedValue}
          />
        )}
      </div>
    </div>
  );
}

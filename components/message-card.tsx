import { useState } from "react";
import Image from "next/image";
import { useAIState } from "ai/rsc";
import { PutBlobResult } from "@vercel/blob";
import { motion } from "framer-motion";

import { AIState } from "@/app/ai";
import { modelVariableOptions } from "@/libs/models";

import Select from "@/components/select";
import ProviderImage from "@/components/provider-image";

interface MessageProps {
  id: string;
  role: string;
  content?: React.ReactNode;
  display?: React.ReactNode;
  spinner?: React.ReactNode;
  file?: PutBlobResult;
  model?: string;
}

export default function MessageCard({
  id,
  role,
  content,
  display,
  spinner,
  file,
  model,
}: MessageProps) {
  const [, setAIState] = useAIState();
  const [selectModel, setSelectModel] = useState<string>(model || "");

  const selectedModel = modelVariableOptions.find(
    (option) => option.value === model,
  );

  function setSelectedValue(value: string) {
    setAIState((AIState: AIState) => ({
      ...AIState,
      currentModelVariable: value,
    }));
    setSelectModel(value);
  }

  return (
    <motion.div
      // initial={{ y: 50, opacity: 0 }}
      // animate={{ y: 0, opacity: 1 }}
      key={id}
      className="flex animate-message_appear flex-row items-start gap-2 whitespace-pre-wrap pb-8"
    >
      <div className="flex flex-row items-center gap-4">
        {role !== "user" && (
          <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-50">
            {selectedModel?.provider && (
              <ProviderImage provider={selectedModel?.provider} />
            )}
          </div>
        )}
      </div>
      <div
        className={`flex w-full min-w-0 max-w-full flex-col gap-2 ${role === "user" && "items-end"}`}
      >
        {role !== "user" && (
          <h5 className="text-md pt-1 font-semibold text-zinc-950 dark:text-zinc-300">
            {selectedModel?.label.toString()}
          </h5>
        )}
        {file && (
          <Image
            src={file.url}
            alt="file"
            height={160}
            width={160}
            className="w-auto rounded-lg"
          />
        )}
        <div
          className={`flex flex-col gap-4 text-zinc-950 dark:text-zinc-300 ${role === "user" && "w-auto rounded-xl bg-zinc-200/60 px-4 py-2 dark:bg-zinc-800"}`}
        >
          {display && <div>{display}</div>}
          {content && <div>{content}</div>}
          {spinner}
        </div>
        {role === "assistant" && (
          <div className="mt-2 flex flex-row gap-1">
            <Select
              variant="secondary"
              options={modelVariableOptions}
              selectedValue={selectModel}
              setSelectedValue={setSelectedValue}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

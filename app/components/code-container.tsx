"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Button from "./button";

type CodeContainerProps = {
  capitalizedLanguage: string;
  language: string;
  children: any;
};

const CodeContainer = ({
  capitalizedLanguage,
  language,
  children,
}: CodeContainerProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setIsCopied(true);
  };

  setTimeout(() => {
    setIsCopied(false);
  }, 4000);

  return (
    <div className="flex flex-col text-zinc-200 rounded-md overflow-hidden bg-zinc-900 border border-zinc-300 dark:border-zinc-800">
      <div className="flex justify-between relative bg-zinc-700 text-zinc:600 px-4 py-2 text-xs">
        <div>{capitalizedLanguage}</div>
        <button onClick={handleCopy}>{isCopied ? "Copied" : "Copy"}</button>
        {/* <Button onClick={handleCopy} variant={"secondary"}>Copy</Button> */}
      </div>
      <SyntaxHighlighter
        PreTag="div"
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: "0", background: "none" }}
        children={String(children).replace(/\n$/, "")}
      />
    </div>
  );
};

export default CodeContainer;

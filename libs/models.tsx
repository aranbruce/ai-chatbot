export type Provider = "openai" | "claude" | "gemini" | "mistral" | "llama";

export const modelVariableOptions = [
  {
    value: "gpt-4o-mini",
    label: "4o Mini",
    provider: "openai" as Provider,
  },
  {
    value: "gpt-4o",
    label: "4o",
    provider: "openai" as Provider,
  },
  {
    value: "gpt-4-turbo",
    label: "4 Turbo",
    provider: "openai" as Provider,
  },
  {
    value: "gpt-3.5-turbo",
    label: "3.5 Turbo",
    provider: "openai" as Provider,
  },
  // {
  //   value: "gemini-1.5-pro-latest",
  //   label: "1.5 Pro",
  //   provider: "gemini" as Provider,
  // },
  // {
  //   value: "gemini-1.5-flash-latest",
  //   label: "1.5 Flash",
  //   provider: "gemini" as Provider,
  // },
  {
    value: "mistral-large-latest",
    label: "Large",
    provider: "mistral" as Provider,
  },
  {
    value: "claude-3-5-sonnet-20240620",
    label: "3.5 Sonnet",
    provider: "claude" as Provider,
  },
  {
    value: "claude-3-opus-20240229",
    label: "3 Opus",
    provider: "claude" as Provider,
  },
  {
    value: "claude-3-sonnet-20240229",
    label: "3 Sonnet",
    provider: "claude" as Provider,
  },
  {
    value: "claude-3-haiku-20240307",
    label: "3 Haiku",
    provider: "claude" as Provider,
  },
  {
    value: "llama3-70b-8192",
    label: "3-70b",
    provider: "llama" as Provider,
  },
];

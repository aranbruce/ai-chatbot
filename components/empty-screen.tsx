import Select from "./select";

import { SelectProps } from "./select";

interface EmptyScreenProps {
  handleExampleClick: (message: string) => void;
  SelectProps: SelectProps;
}

const exampleMessages = [
  {
    heading: "New York Pizza",
    subheading: "Recommend great pizza places in New York",
    message: "Recommend great pizza places in New York",
  },
  {
    heading: "Weather",
    subheading: "Show me the weather in London",
    message: "Show me the weather in London",
  },
  {
    heading: "News",
    subheading: "Get the latest news about GenAI",
    message: "Get the latest news about GenAI",
  },
  {
    heading: "Action movies",
    subheading: "What are some great action movies?",
    message: "What are some great action movies?",
  },
];

export default function EmptyScreen({
  handleExampleClick,
  SelectProps,
}: EmptyScreenProps) {
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
        {exampleMessages.map((example, index) => (
          <button
            key={example.heading}
            className={`cursor-pointer rounded-xl bg-zinc-100 p-4 text-left transition hover:bg-zinc-200 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-slate-950/20 active:border-zinc-900 dark:bg-zinc-900 hover:dark:border-zinc-800 hover:dark:bg-zinc-800
            dark:focus-visible:ring-white/40 ${index > 1 && "hidden md:block"}`}
            onClick={() => handleExampleClick(example.message)}
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

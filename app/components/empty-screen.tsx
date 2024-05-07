interface EmptyScreenProps {
  handleExampleClick: (message: string) => void;
}

const exampleMessages = [
  {
    heading: "New York Pizza",
    subheading: "Recommend great pizza places in New York",
    message: "Recommend great pizza places in New York",
  },
  {
    heading: "Weather",
    subheading: "Show me the weather like in London",
    message: "Show me the weather like in London",
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

const EmptyScreen = ({ handleExampleClick }: EmptyScreenProps) => {
  return (
    <div className="flex flex-col h-full min-h-fit justify-between gap-6">
      <div className="flex flex-col gap-1 content-center h-full justify-center items-center text-center">
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">
          Hi I'm Pal
        </h1>
        <p className="text-muted-foreground leading-normal text-zinc-500 dark:text-zinc-400">
          How can I help today?
        </p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {exampleMessages.map((example, index) => (
          <button
            key={example.heading}
            className={`transition cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 p-4 hover:dark:border-zinc-800 hover:bg-zinc-200 hover:dark:bg-zinc-800 active:border-zinc-900 focus-visible:ring-[3px] focus-visible:ring-slate-950/20 focus-visible:border-zinc-400 dark:focus-visible:ring-white/40
            text-left ${index > 1 && "hidden md:block"}`}
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
};

export default EmptyScreen;

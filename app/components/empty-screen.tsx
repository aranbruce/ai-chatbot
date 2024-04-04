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
    subheading: "What is the weather like in London?",
    message: "What is the weather like in London?"
  },
  {
    heading: "News",
    subheading: "Get the latest news about GenAI",
    message: "Get the latest news about GenAI"
  },
  {
    heading: "Action movies",
    subheading: "What are some great action movies?",
    message: "What are some great action movies?"
  }
]



const EmptyScreen = ({handleExampleClick}:EmptyScreenProps) => {
  return (
    <div className="flex flex-col h-full min-h-fit justify-between gap-6">
      <div className="bg-white dark:bg-zinc-900 flex flex-col gap-1 border-zinc-200 dark:border-zinc-800 rounded-lg border p-6">
        <h1 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">Welcome to a demo AI chatbot with function calling!</h1>
        <p className="text-muted-foreground leading-normal text-zinc-500 dark:text-zinc-400">
          This is an demo chatbot app template that helps answer your chatbot perform functions like searching the web.
        </p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {exampleMessages.map((example, index) => (
          <button
            key={example.heading}
            className={`transition cursor-pointer rounded-lg border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-4 hover:border-zinc-400 hover:dark:border-zinc-800 hover:bg-zinc-50 hover:dark:bg-zinc-800 hover:shadow-md active:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-200 focus-visible:border-zinc-400
            text-left ${
              index > 1 && "hidden md:block"
            }`}
            onClick={() => handleExampleClick(example.message)}
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{example.heading}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {example.subheading}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmptyScreen;
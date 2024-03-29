interface EmptyScreenProps {
  handleExampleClick: (message: string) => void;
}

const exampleMessages = [
  {
    heading: "Work gifs",
    subheading: "Show me some gifs about work",
    message: "Show me some gifs about work"
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
      <div className="bg-white flex flex-col gap-1 rounded-lg border p-6">
        <h1 className="text-lg font-semibold">Welcome to a demo AI chatbot with function calling!</h1>
        <p className="text-muted-foreground leading-normal text-zinc-500">
          This is an demo chatbot app template that helps answer your chatbot perform functions like searching the web.
        </p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {exampleMessages.map((example, index) => (
          <button
            key={example.heading}
            className={`transition cursor-pointer rounded-lg border bg-white p-4 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:border-gray-900 focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:border-gray-400
            text-left ${
              index > 1 && "hidden md:block"
            }`}
            onClick={() => handleExampleClick(example.message)}
          >
            <div className="text-sm font-semibold">{example.heading}</div>
            <div className="text-sm text-zinc-500">
              {example.subheading}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmptyScreen;
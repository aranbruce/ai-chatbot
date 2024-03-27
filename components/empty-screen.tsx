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
    heading: "Search",
    subheading: "Search for the best AI tools this week",
    message: "Search for the best AI tools this week"
  }
]



const EmptyScreen = ({handleExampleClick}:EmptyScreenProps) => {
  return (
    <div className="flex flex-col h-full justify-between gap-2">
      <div className="bg-background flex flex-col gap-1 rounded-lg border p-8">
        <h1 className="text-lg font-semibold">Welcome to a demo AI chatbot with function calling!</h1>
        <p className="text-muted-foreground leading-normal">
          This is an demo chatbot app template that helps answer your chatbot perform functions like searching the web.
        </p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {exampleMessages.map((example, index) => (
          <button
            key={example.heading}
            className={`transition cursor-pointer rounded-lg border bg-white p-4 hover:border-gray-500 active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:border-gray-500
            text-left ${
              index > 1 && "hidden md:block"
            }`}
            onClick={() => handleExampleClick(example.message)}
          >
            <div className="text-sm font-semibold">{example.heading}</div>
            <div className="text-sm text-zinc-600">
              {example.subheading}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmptyScreen;
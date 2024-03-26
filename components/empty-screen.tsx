
const EmptyScreen = () => {
  return (
    <>
      <div className="bg-background flex flex-col gap-1 rounded-lg border p-8 shadow-md">
        <h1 className="text-lg font-semibold">Welcome to a demo AI chatbot with function calling!</h1>
        <p className="text-muted-foreground leading-normal">
          This is an demo chatbot app template that helps answer your chatbot perform functions like searching the web.
        </p>
      </div>
      {/* <div onClick={() => handleSuggesstionClick("What's the weather in London")} className="rounded-lg border p-4">Click me</div> */}
    </>
  )
}

export default EmptyScreen;
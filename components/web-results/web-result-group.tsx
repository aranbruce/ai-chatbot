import WebResult from "./web-result";
import { WebResultProps } from "./web-result";

export default function WebResultGroup({
  summaryUI,
  results,
}: {
  summaryUI: any;
  results: WebResultProps[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-base font-semibold">Sources</h3>
        <div className="flex w-full flex-row gap-2 overflow-scroll">
          {results.map((result, index) => (
            <WebResult
              key={index}
              title={result.title}
              description={result.description}
              url={result.url}
              date={result.date}
              author={result.author}
              imageURL={result.imageURL}
            />
          ))}
        </div>
        <div className="flex w-full flex-col gap-2">
          <h3 className="text-base font-semibold">Answer</h3>
          {summaryUI}
        </div>
      </div>
    </div>
  );
}

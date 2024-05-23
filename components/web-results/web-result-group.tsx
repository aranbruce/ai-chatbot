import WebResult from "./web-result";
import { WebResultProps } from "./web-result";

export default function WebResultGroup ({ results }: { results: WebResultProps[] }) {
  return (
    <div className="flex w-full flex-col gap-10">
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
  );
};
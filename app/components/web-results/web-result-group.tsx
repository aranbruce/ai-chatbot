import WebResult from "./web-result";
import { WebResultProps } from "./web-result";

const WebResultGroup = ({ results }: { results: WebResultProps[] }) => {
  return (
    <div className="flex flex-col gap-10 w-full">
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

export default WebResultGroup;

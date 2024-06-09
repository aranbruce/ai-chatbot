import NewsCard from "./news-card";
import { NewsCardProps } from "./news-card";

export default function NewsCardGroup({
  results,
  summary,
}: {
  results: NewsCardProps[];
  summary: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-base font-semibold">Sources</h3>
        <div className="flex w-full flex-row gap-2 overflow-scroll">
          {results.map((newsItem, index) => (
            <NewsCard
              key={index}
              title={newsItem.title}
              description={newsItem.description}
              url={newsItem.url}
              imageURL={newsItem.imageURL}
              date={newsItem.date}
              author={newsItem.author}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-base font-semibold">Answer</h3>
        {summary}
      </div>
    </div>
  );
}

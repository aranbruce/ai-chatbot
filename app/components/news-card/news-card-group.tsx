import NewsCard from "./news-card";
import { NewsCardProps } from "./news-card";

const NewsCardGroup = ({ news }: { news: NewsCardProps[] }) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {news.map((newsItem, index) => (
        <NewsCard
          key={index}
          title={newsItem.title}
          description={newsItem.description}
          url={newsItem.url}
          image={newsItem.image}
          date={newsItem.date}
        />
      ))}
    </div>
  );
};

export default NewsCardGroup;

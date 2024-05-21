import NewsCardSkeleton from "./news-card-skeleton";

const NewsCardGroupSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      {[...Array(4)].map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default NewsCardGroupSkeleton;

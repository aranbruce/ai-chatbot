import NewsCardSkeleton from "./news-card-skeleton";

export default function NewsCardGroupSkeleton () {
  return (
    <div className="flex w-full flex-col gap-8">
      {[...Array(4)].map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
};
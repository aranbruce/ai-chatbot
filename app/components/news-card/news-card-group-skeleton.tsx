import NewsCardSkeleton from "./news-card-skeleton";



const NewsCardGroupSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {[...Array(4)].map((_, index) => (
        <NewsCardSkeleton key={index}/>
      ))}
    </div>
  )
}

export default NewsCardGroupSkeleton;

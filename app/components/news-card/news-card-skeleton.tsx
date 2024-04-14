import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const NewsCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-col md:flex-row gap-4 w-full p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <div className="h-40 w-full md:h-32 md:w-32 rounded-xl shrink-0 overflow-hidden p">
            <div className="mt-[-8px]">
              <Skeleton height={300} />
            </div>
          </div>
        <div className="flex flex-col gap-2 w-full">
          <Skeleton count={1} height={32} />
          <Skeleton count={1} height={12} width={96}/>
          <Skeleton count={3} height={16} />
          <Skeleton count={1} height={12} width={64}/>
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default NewsCardSkeleton
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NewsCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex w-full flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-950">
        <div className="p h-40 w-full shrink-0 overflow-hidden rounded-xl md:h-32 md:w-32">
          <div className="mt-[-8px]">
            <Skeleton height={300} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Skeleton count={1} height={32} />
          <Skeleton count={1} height={12} width={96} />
          <Skeleton count={3} height={16} />
          <Skeleton count={1} height={12} width={64} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NewsCardSkeleton;

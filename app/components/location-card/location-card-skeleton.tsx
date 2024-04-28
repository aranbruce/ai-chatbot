import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LocationCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-col gap-4 py-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
        <div className="flex flex-col px-4 gap-2">
          <div className="flex flex-row gap-4 justify-between text-zinc-950 dark:text-white ">
            <Skeleton width={150} height={20} />
            <Skeleton width={50} height={20} />
          </div>
          <div className="flex flex-row gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <Skeleton width={100} height={16} />
            <Skeleton width={80} height={16} />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <Skeleton count={2} height={16} />
          <Skeleton width={80} height={20} />
        </div>
        <div className="flex flex-row gap-4 px-4 items-center overflow-x-scroll max-w-full">
          <Skeleton
            width={160}
            height={144}
            className="rounded-lg h-36 w-48 shrink-0"
          />
        </div>
        <div className="flex w-fit px-4">
          <Skeleton width={150} height={40} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default LocationCardSkeleton;

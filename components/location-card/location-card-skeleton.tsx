import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LocationCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white leading-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Skeleton
          height={140}
          borderRadius={0}
          className="h-36 w-48 rounded-none"
        />
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-row justify-between gap-4 text-zinc-950 dark:text-white">
            <Skeleton width={150} height={18} />
            <Skeleton width={32} height={18} />
          </div>
          <div className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <Skeleton containerClassName="flex-1" height={14} />
            <Skeleton width={80} height={14} />
          </div>
          <Skeleton width={150} height={40} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

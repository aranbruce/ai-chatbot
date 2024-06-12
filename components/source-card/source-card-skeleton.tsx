import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SourceCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex min-w-0 flex-col justify-between gap-3 rounded-md border border-zinc-100 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800">
        <div className="flex w-full flex-col gap-2">
          <Skeleton count={1} height={18} width={128} />
        </div>
        <div className="flex w-full flex-row gap-2 rounded-full">
          <Skeleton count={1} height={16} width={16} />
          <Skeleton count={1} height={16} width={64} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

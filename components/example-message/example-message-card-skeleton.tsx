import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ExampleMessageCardSkeleton({
  index,
}: {
  index: number;
}) {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div
        className={`dark:border-700 flex cursor-pointer flex-col gap-1 rounded-xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition hover:bg-zinc-100 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-slate-950/20 active:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 hover:dark:border-zinc-700 hover:dark:bg-zinc-800 dark:focus-visible:border-zinc-800
            dark:focus-visible:ring-white/40 ${index > 1 && "hidden md:flex"}`}
      >
        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          <Skeleton width={96} height={18} />
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          <Skeleton height={14} />
          <Skeleton width={96} height={14} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SourceCardSkeleton from "@/components/source-card/source-card-skeleton";

export default function WebResultCardGroupSkeleton() {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-col gap-8">
        <div className="flex w-full flex-col gap-2 overflow-scroll">
          <h3 className="text-base font-semibold">Sources</h3>
          <div className="grid w-full grid-cols-1 flex-row gap-2 overflow-visible sm:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <SourceCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col">
          <h3 className="text-base font-semibold">Answer</h3>
          <Skeleton count={2} height={14} />
          <Skeleton count={1} height={14} width={64} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

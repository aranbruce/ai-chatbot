import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CurrentWeatherCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="text-xs font-medium text-zinc-400">
          Weather Forecast: Loading...
        </h5>
        <div className="flex w-full flex-col items-start gap-4 rounded-lg border border-zinc-200 bg-blue-400 p-3 text-white shadow-md md:p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-medium">
              <Skeleton width={100} />
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row gap-1">
                <h2 className="text-2xl font-semibold">
                  <Skeleton width={32} height={32} />
                </h2>
                <h5>
                  <Skeleton width={8} />
                </h5>
              </div>
              <Skeleton width={40} height={40} />
            </div>
          </div>

          <div className="grid w-full  auto-cols-min grid-cols-7 gap-4">
            {[...Array(7)].map((_, index: number) => (
              <div className="flex w-8 flex-col items-center gap-1" key={index}>
                <h5 className="text-xs text-zinc-100">
                  <Skeleton width={20} />
                </h5>
                <Skeleton height={32} width={32} />
                <div className="flex flex-row items-center gap-[0.125rem] font-semibold">
                  <h4 className="font-medium">
                    <Skeleton width={16} />
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function WeatherForecastCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="w-full text-center text-xs font-medium text-zinc-400">
          Weather Forecast Loading...
        </h5>
        <div className="flex w-full flex-col gap-4 rounded-lg border border-zinc-200 bg-blue-400 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton count={1} height={28} width={128} />
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between gap-2 sm:flex-col"
              >
                <p className="min-w-10 text-center text-sm text-white">
                  <Skeleton count={1} />
                </p>
                <div>
                  <Skeleton height={24} width={32} />
                </div>

                <h5 className="flex flex-row gap-1 text-xl font-medium text-white">
                  <Skeleton count={1} height={24} width={32} />
                  <Skeleton count={1} height={8} width={8} />
                </h5>
                <div className="flex flex-row items-center gap-4 text-center">
                  <div className="flex flex-col gap-0.5 text-white">
                    <p className="text-xs">
                      <Skeleton count={1} height={10} width={20} />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

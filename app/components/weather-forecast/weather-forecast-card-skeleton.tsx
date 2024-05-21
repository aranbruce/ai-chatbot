import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WeatherForecastCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="w-full text-center text-xs font-medium text-zinc-400">
          Weather Forecast Loading...
        </h5>
        <div className="flex w-full flex-col gap-4 rounded-lg border border-zinc-200 bg-blue-400 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton count={1} height={28} width={128} />
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="gap:2 grid w-full grid-cols-[72px_32px_56px_60px] items-center justify-between sm:gap-4"
            >
              <p className="text-white">
                <Skeleton count={1} />
              </p>
              <div>
                <Skeleton height={32} width={32} />
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
                  <p className="font-medium">
                    <Skeleton count={1} height={16} width={28} />
                  </p>
                </div>
                <div className="flex flex-col gap-0.5 text-white">
                  <p className="text-xs">
                    <Skeleton count={1} height={10} width={20} />
                  </p>
                  <p className="font-medium">
                    <Skeleton count={1} height={16} width={28} />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default WeatherForecastCardSkeleton;

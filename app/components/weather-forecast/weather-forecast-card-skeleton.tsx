import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WeatherForecastCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-col items-center gap-2 w-full">
        <h5 className="text-xs font-medium text-zinc-400 w-full text-center">
          Weather Forecast Loading...
        </h5>
        <div className="flex flex-col gap-4 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-blue-400 dark:bg-zinc-900 w-full">
          <Skeleton count={1} height={28} width={128} />
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[72px_32px_56px_60px] justify-between gap:2 sm:gap-4 w-full items-center"
            >
              <p className="text-white">
                <Skeleton count={1} />
              </p>
              <div>
                <Skeleton height={32} width={32} />
              </div>

              <h5 className="flex flex-row gap-1 font-medium text-xl text-white">
                <Skeleton count={1} height={24} width={32} />
                <Skeleton count={1} height={8} width={8} />
              </h5>
              <div className="flex flex-row gap-4 items-center text-center">
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

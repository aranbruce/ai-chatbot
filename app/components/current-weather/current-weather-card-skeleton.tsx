import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const CurrentWeatherCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-col items-center gap-2 w-full">
        <h5 className="text-xs font-medium text-zinc-400">Weather Forecast: Loading...</h5>
        <div className="flex flex-col shadow-md gap-4 w-full rounded-lg items-start bg-blue-400 dark:bg-zinc-900 text-white p-4 border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-medium">
              <Skeleton width={100} />
            </h5>
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-row gap-1">
                <h2 className="text-2xl font-semibold"><Skeleton width={32} height={32}/></h2>
                <h5><Skeleton width={8}/></h5>
              </div>
              <Skeleton width={40} height={40}/>
            </div>
          </div>
          
          <div className="flex flex-row gap-4 w-full justify-start">
          {[...Array(7)].map((_, index: number) => (
            <div className="flex flex-col gap-2 items-center basis-1/4 sm:basis-[12%]" key={index}>
              <h5 className="text-xs text-zinc-100">
                <Skeleton width={20} />
              </h5>
              <Skeleton height={32} width={32}/>
              <div className="flex flex-row gap-[0.125rem] font-semibold items-center">
                <h4 className="font-medium"><Skeleton width={16}/></h4>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default CurrentWeatherCardSkeleton
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const WebResultCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#f4f4f5">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
            <Skeleton count={1} height={28} width={160}/>
            <div className="flex flex-row gap-2 w-full">
              <Skeleton count={1} width={96} height={16} />
              <Skeleton count={1} width={64} height={16} />
            </div>
            <Skeleton count={2} height={20} />
            <Skeleton count={1} width={120}/>
          </div>
      </div>
    </SkeletonTheme>
  )
}

export default WebResultCardSkeleton
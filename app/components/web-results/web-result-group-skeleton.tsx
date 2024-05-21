import WebResultSkeleton from "./web-result-skeleton";

const WebResultCardGroupSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      {[...Array(4)].map((_, index) => (
        <WebResultSkeleton key={index} />
      ))}
    </div>
  );
};

export default WebResultCardGroupSkeleton;

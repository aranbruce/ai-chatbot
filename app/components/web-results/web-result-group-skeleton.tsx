import WebResultSkeleton from "./web-result-skeleton";

const WebResultCardGroupSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {[...Array(4)].map((_, index) => (
        <WebResultSkeleton key={index} />
      ))}
    </div>
  );
};

export default WebResultCardGroupSkeleton;

import ExampleMessageCardSkeleton from "./example-message-card-skeleton";

export default function ExampleMessageCardGroupSkeleton() {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <ExampleMessageCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
}

import LocationCardSkeleton from "./location-card-skeleton";

export default function LocationCardGroupSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      {[...Array(3)].map((_, index) => (
        <LocationCardSkeleton key={index} />
      ))}
    </div>
  );
};
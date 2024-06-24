import LocationCardSkeleton from "./location-card-skeleton";

export default function LocationCardGroupSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {[...Array(2)].map((_, index) => (
        <LocationCardSkeleton key={index} />
      ))}
    </div>
  );
}

import LocationCardSkeleton from "./location-card-skeleton";

const LocationCardGroupSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4">
      {[...Array(3)].map((_, index) => (
        <LocationCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LocationCardGroupSkeleton;

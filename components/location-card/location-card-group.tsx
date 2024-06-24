import LocationCard, { LocationCardProps } from "./location-card";

type LocationCardGroupProps = {
  locations: LocationCardProps[];
};

export default function LocationCardGroup({
  locations,
}: LocationCardGroupProps) {
  return (
    <>
      <div className="columns-1 gap-2 space-y-4 sm:columns-2">
        {locations.map((location: LocationCardProps, index: number) => (
          <LocationCard key={index} location={location} />
        ))}
      </div>
    </>
  );
}

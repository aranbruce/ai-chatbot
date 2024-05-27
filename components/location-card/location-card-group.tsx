import LocationCard, { LocationCardProps } from "./location-card";

type LocationCardGroupProps = {
  locations: LocationCardProps[];
};

export default function LocationCardGroup({
  locations,
}: LocationCardGroupProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {locations.map((location: any, index: number) => (
          <LocationCard key={index} location={location} />
        ))}
      </div>
    </>
  );
}

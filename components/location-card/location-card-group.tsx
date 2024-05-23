import LocationCard, { LocationCardProps } from "./location-card";

type LocationCardGroupProps = {
  locations: LocationCardProps[];
};

export default function LocationCardGroup ({ locations }: LocationCardGroupProps) {
  return (
    <>
      <div className="flex flex-col gap-8">
        {locations.map((location: any, index: number) => (
          <LocationCard key={index} location={location} />
        ))}
      </div>
    </>
  );
};
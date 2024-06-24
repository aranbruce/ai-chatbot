import Button from "../button";

export interface LocationCardProps {
  name: string;
  rating?: string;
  rating_image_url?: string;
  description: string;
  priceLevel?: string;
  tripadvisorUrl?: string;
  address?: string;
  photoUrls?: string[];
}

export default function LocationCard({
  location,
}: {
  location: LocationCardProps;
}) {
  return (
    <div className="flex h-fit flex-col justify-between gap-4 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col">
        {Array.isArray(location.photoUrls) && (
          <div className="flex flex-row items-center gap-4 overflow-x-scroll">
            {location.photoUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={location.name}
                height={144}
                className="h-36 w-full shrink-0"
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
        )}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-4 text-zinc-950 dark:text-white">
              <h3 className="text-sm font-semibold">{location.name}</h3>
              {location.rating && (
                <div className="flex flex-row gap-1">
                  <h5 className="pt-[3px] text-sm font-medium">
                    {location.rating}
                  </h5>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.55166 2.24164C7.73507 1.87006 8.26495 1.87006 8.44836 2.24164L9.94379 5.27121C10.0166 5.41863 10.1572 5.52086 10.3198 5.54464L13.6648 6.03355C14.0747 6.09348 14.2381 6.5974 13.9413 6.88648L11.5217 9.24317C11.4038 9.35804 11.35 9.5236 11.3778 9.68587L11.9487 13.0146C12.0188 13.4231 11.59 13.7346 11.2232 13.5417L8.23274 11.9691C8.08704 11.8924 7.91298 11.8924 7.76728 11.9691L4.77683 13.5417C4.41001 13.7346 3.98124 13.4231 4.0513 13.0146L4.62222 9.68587C4.65005 9.5236 4.59622 9.35804 4.47828 9.24317L2.05868 6.88648C1.76189 6.5974 1.92528 6.09348 2.33524 6.03355L5.68019 5.54464C5.84287 5.52086 5.98346 5.41863 6.05623 5.27121L7.55166 2.24164Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-4 text-xs text-zinc-600 dark:text-zinc-400">
              <p className="line-clamp-1">{location.address}</p>
              {location.priceLevel && (
                <p className="line shrink-0">Price: {location.priceLevel}</p>
              )}
            </div>
          </div>
          {location.description && (
            <div className="flex flex-col">
              <p className="line-clamp-3 text-sm text-zinc-700 dark:text-zinc-400">
                {location.description}
              </p>
            </div>
          )}
          {location.tripadvisorUrl && (
            <div className="flex w-fit">
              <Button
                href={location.tripadvisorUrl}
                openInNewTab
                variant="secondary"
              >
                View on TripAdvisor
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

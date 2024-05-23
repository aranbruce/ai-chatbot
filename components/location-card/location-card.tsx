"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import Button from "../button";

export interface LocationCardProps {
  name: string;
  rating: string;
  rating_image_url: string;
  description: string;
  priceLevel: string;
  tripadvisorUrl: string;
  address: string;
  photoUrls: string[];
}

export default function LocationCard ({ location }: { location: LocationCardProps }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [location.description]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-2 px-4">
        <div className="flex flex-row justify-between gap-4 text-zinc-950 dark:text-white ">
          <h3 className="font-semibold">{location.name}</h3>
          <h5 className="font-medium">{location.rating} ⭐️</h5>
        </div>
        <div className="flex flex-row gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <p>{location.address}</p>
          <p className="shrink-0">Price: {location.priceLevel}</p>
        </div>
      </div>
      {location.description && (
        <div className="flex flex-col gap-2 px-4">
          <p
            ref={descriptionRef}
            className={`text-sm text-zinc-700 dark:text-zinc-400 ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {location.description}
          </p>
          {isOverflowing && (
            <button
              onClick={toggleExpanded}
              className="w-fit text-sm font-semibold"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
      <div className="flex flex-row items-center gap-4 overflow-x-scroll px-4 ">
        {Array.isArray(location.photoUrls) &&
          location.photoUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={location.name}
              width={192}
              height={144}
              className="h-36 w-48 shrink-0 rounded-lg"
              style={{ objectFit: "cover" }}
            />
          ))}
      </div>
      <div className="flex w-fit px-4">
        <Button href={location.tripadvisorUrl} openInNewTab variant="secondary">
          View on TripAdvisor
        </Button>
      </div>
    </div>
  );
};
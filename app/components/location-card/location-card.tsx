"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

import Button from "../button";

interface LocationCardProps {
  name: string;
  rating: string;
  rating_image_url: string;
  description: string;
  priceLevel: string;
  tripadvisor_url: string;
  address: string;
  photoUrls: string[];
}


const LocationCard = ({location}: {location: LocationCardProps}) => { 
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
    <div className="flex flex-col gap-4 py-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg">
      <div className="flex flex-col px-4 gap-2">
        <div className="flex flex-row gap-4 justify-between text-zinc-950 dark:text-white ">
          <h3 className="font-semibold">{location.name}</h3>
          <h5 className="font-medium">{location.rating}</h5>
        </div>
        <div className="flex flex-row gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <p>{location.address}</p>
          <p className="shrink-0">Price: {location.priceLevel}</p>
        </div>
      </div>
      {location.description && (
        <div className="flex flex-col gap-2 px-4">
          <p ref={descriptionRef} className={`text-sm text-zinc-700 dark:text-zinc-400 ${isExpanded ? '' : 'line-clamp-2'}`}>{location.description}</p>
          {isOverflowing && (
            <button onClick={toggleExpanded} className="text-sm font-semibold w-fit">
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
      <div className="flex flex-row gap-4 px-4 items-center overflow-x-scroll ">
        {/* {JSON.stringify(location.photoUrls)} */}
        {/* show an image for each item in the location.photoUrls array */}
        { Array.isArray(location.photoUrls) && (
          location.photoUrls.map((url, index) => (
            <Image key={index} src={url} alt={location.name} width={192} height={144} className="rounded-lg h-36 w-48 shrink-0" style={{objectFit:"cover"}}/>
          ))
        )}
        {/* <Image className="rounded-lg" style={{objectFit:"cover"}} src={location.photoUrls[0]} width={100} height={80} alt="Location Image" />
        <Image className="rounded-lg" src={location.photoUrls[1]} width={100} height={80} alt="Location Image" />
        <Image className="rounded-lg" src={location.photoUrls[2]} width={100} height={80} alt="Location Image" /> */}

        
        
      </div>
      <div className="flex w-fit px-4">
        <Button href={location.tripadvisor_url} openInNewTab variant="secondary">View on TripAdvisor</Button>
      </div>
      {/* {JSON.stringify(location)} */}
    </div>
    
  );
}

export default LocationCard;
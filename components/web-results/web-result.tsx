import { decode } from "html-entities";
import Image from "next/image";

export interface WebResultProps {
  title: string;
  description: string;
  url: string;
  date: string;
  author: string;
  imageURL?: string;
}

export default function WebResult({
  title,
  description,
  url,
  date,
  author,
  imageURL,
}: WebResultProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-40 flex-col justify-between gap-4 rounded-md border border-zinc-100 bg-zinc-50 p-2 hover:border-zinc-200 hover:bg-zinc-100"
    >
      <h3 className="line-clamp-2 text-xs font-semibold text-zinc-950 dark:text-white">
        {title}
      </h3>
      <div className="flex w-full flex-row gap-2">
        {imageURL && (
          <Image
            className="rounded-full"
            src={imageURL}
            alt={title}
            width={16}
            height={16}
          />
        )}
        <h5 className="text-xs">{author}</h5>
      </div>
    </a>
  );
}

import Image from "next/image";

export interface NewsCardProps {
  title: string;
  description: string;
  url: string;
  imageURL: string;
  date: string;
  author: string;
}

export default function NewsCard({
  title,
  description,
  url,
  imageURL,
  date,
  author,
}: NewsCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-72 flex-col justify-between gap-3 rounded-md border border-zinc-100 bg-zinc-50 p-2 hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
    >
      <div className="flex w-full flex-col gap-2">
        <h3 className="line-clamp-3 text-sm font-semibold">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {new Date(date).toLocaleDateString()}
        </p>
        <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <div className="flex w-full flex-row gap-2">
        <Image
          src={imageURL}
          alt={title}
          width={16}
          height={16}
          className="rounded-full"
        />
        <h5 className="text-xs">{author}</h5>
      </div>
    </a>
  );
}

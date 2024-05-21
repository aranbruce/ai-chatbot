export interface NewsCardProps {
  title: string;
  description: string;
  url: string;
  image: string;
  date: string;
}

const NewsCard = ({ image, title, description, url, date }: NewsCardProps) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-950">
      {image && (
        <div
          className="h-40 w-full shrink-0 rounded-xl bg-zinc-200 bg-cover bg-center md:h-32 md:w-32"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      )}
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-md font-semibold">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {new Date(date).toLocaleDateString()}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
        <a
          href={url}
          target="_blank"
          className="text-sm font-semibold text-zinc-950 hover:text-zinc-800 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default NewsCard;

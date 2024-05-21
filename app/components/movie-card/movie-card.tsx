import Image from "next/image";

export type MovieCardProps = {
  title: string;
  description: string;
  imdbRating: number;
  releaseYear: number;
  director: string;
  genre: string;
  stars: string[];
  imageURL: string;
};

const MovieCard = ({
  title,
  description,
  imdbRating,
  releaseYear,
  director,
  genre,
  stars,
  imageURL,
}: MovieCardProps) => {
  return (
    <div className="flex flex-col items-start	 gap-8 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row dark:border-zinc-800 dark:bg-zinc-900">
      {imageURL && (
        <Image
          className="rounded-md"
          src={imageURL}
          width={80}
          height={117}
          alt={title}
        />
      )}
      <div className="flex flex-col justify-between gap-4">
        <h3 className="font-semibold text-zinc-950 dark:text-white">{title}</h3>
        <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-400">
          <p>{description}</p>
          <p>IMDB Rating: {imdbRating}</p>
          <p>Release Year: {releaseYear}</p>
          <p>Director: {director}</p>
          <p>Genre: {genre}</p>
          <div className="flex flex-row flex-wrap gap-2">
            <p>Stars: </p>
            {stars.map((star: string, index: number) => (
              <span key={index}>
                {star}
                {index < stars.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

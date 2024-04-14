export interface NewsCardProps {
  title: string
  description: string
  url: string
  image: string
  date: string
}

const NewsCard = ({ image, title, description, url, date} : NewsCardProps ) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      {image && (
        <div className="h-40 w-full md:h-32 md:w-32 rounded-xl bg-cover bg-center bg-zinc-200 shrink-0" style={{backgroundImage: `url(${image})`}}></div>
      )}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-md font-semibold">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(date).toLocaleDateString()}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        <a href={url} target="_blank" className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 hover:text-zinc-800 dark:hover:text-zinc-300">Read more</a>
      </div>
    </div>
  )
}

export default NewsCard
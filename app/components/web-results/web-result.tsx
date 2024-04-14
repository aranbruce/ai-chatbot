import parse from 'html-react-parser';

export interface WebResultProps {
  title: string
  description: string
  url: string
  date: string
  author: string
}

const WebResult = ({ title, description, url, date, author }: WebResultProps) => {
  return (
  <div className="flex flex-row gap-4 w-full">
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-md font-semibold text-zinc-950 dark:text-white">{title}</h3>
      <div className="flex flex-row gap-2 w-full">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{author}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">{new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {parse(description)}
      </div>
      <a href={url} target="_blank" className="text-sm text-zinc-950 dark:text-white font-semibold hover:text-zinc-700 dark:hover:text-zinc-200">Read more</a>
    </div>
  </div>
  )
}

export default WebResult
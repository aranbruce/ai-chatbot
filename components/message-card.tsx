import { ReactNode } from "react";
import MarkdownContainer from "./markdown";

interface MessageProps {
  id: string;
  role: string;
  content: string | ReactNode | undefined;
  data?: any;
}

export default function MessageCard({ id, role, content }: MessageProps) {
  return (
    <div
      key={id}
      className="animate-message_appear flex flex-row items-start gap-3 whitespace-pre-wrap opacity-0"
    >
      <div className="flex flex-row items-center gap-4">
        {role !== "user" && (
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.56588 3.63798C6.68276 3.23234 7.31724 3.23234 7.43412 3.63798C7.80693 4.93183 8.36439 6.60258 8.8809 7.1191C9.39742 7.63561 11.0682 8.19307 12.362 8.56588C12.7677 8.68276 12.7677 9.31724 12.362 9.43412C11.0682 9.80693 9.39742 10.3644 8.8809 10.8809C8.36439 11.3974 7.80693 13.0682 7.43412 14.362C7.31724 14.7677 6.68276 14.7677 6.56588 14.362C6.19307 13.0682 5.63561 11.3974 5.1191 10.8809C4.60258 10.3644 2.93183 9.80693 1.63798 9.43412C1.23234 9.31724 1.23234 8.68276 1.63798 8.56588C2.93183 8.19307 4.60258 7.63561 5.1191 7.1191C5.63561 6.60258 6.19307 4.93183 6.56588 3.63798Z" />
              <path d="M10.9189 0.737535C10.9453 0.660182 11.0547 0.660182 11.0811 0.737535L11.4955 1.95107C11.5041 1.97618 11.5238 1.9959 11.5489 2.00448L12.7625 2.41888C12.8398 2.4453 12.8398 2.5547 12.7625 2.58112L11.5489 2.99552C11.5238 3.0041 11.5041 3.02382 11.4955 3.04893L11.0811 4.26247C11.0547 4.33982 10.9453 4.33982 10.9189 4.26246L10.5045 3.04893C10.4959 3.02382 10.4762 3.0041 10.4511 2.99552L9.23753 2.58112C9.16018 2.5547 9.16018 2.4453 9.23754 2.41888L10.4511 2.00448C10.4762 1.9959 10.4959 1.97618 10.5045 1.95107L10.9189 0.737535Z" />
              <path d="M13.9392 4.17815C13.959 4.12014 14.041 4.12014 14.0608 4.17815L14.3716 5.0883C14.3781 5.10713 14.3929 5.12193 14.4117 5.12836L15.3218 5.43916C15.3799 5.45897 15.3799 5.54103 15.3218 5.56084L14.4117 5.87164C14.3929 5.87807 14.3781 5.89287 14.3716 5.9117L14.0608 6.82185C14.041 6.87986 13.959 6.87986 13.9392 6.82185L13.6284 5.9117C13.6219 5.89287 13.6071 5.87807 13.5883 5.87164L12.6782 5.56084C12.6201 5.54103 12.6201 5.45897 12.6782 5.43916L13.5883 5.12836C13.6071 5.12193 13.6219 5.10713 13.6284 5.0883L13.9392 4.17815Z" />
            </svg>
          </div>
        )}
      </div>
      <div
        className={`flex w-full max-w-full flex-col gap-1 ${role === "user" && "items-end"}`}
      >
        {role !== "user" && (
          <h5 className="text-md pt-1 font-semibold text-zinc-950 dark:text-zinc-300">
            {role}
          </h5>
        )}

        <div
          className={`flex flex-col gap-4 text-zinc-950 dark:text-zinc-300 ${role === "user" && "w-auto rounded-xl bg-zinc-200/60 px-4 py-2 dark:bg-zinc-800"}`}
        >
          {typeof content === "string" ? (
            <MarkdownContainer children={content} />
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}

import { PutBlobResult } from "@vercel/blob";
import Spinner from "@/components/spinner";
import Button from "@/components/button";

type FileUploadCardProps = {
  fileUpload: FileUpload | null;
  setFileUpload: (file: FileUpload | null) => void;
};

export interface FileUpload extends PutBlobResult {
  name: string;
  size: number;
  isUploading: boolean;
}

export default function FileUploadCard({
  fileUpload,
  setFileUpload,
}: FileUploadCardProps) {
  return (
    <div className="m-2 flex w-full flex-row flex-wrap justify-start">
      <div className="relative flex w-fit flex-row items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-800 dark:text-white">
        <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-2 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 21C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21H7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 3V9H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M9 13H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 17H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {fileUpload && fileUpload.name}
        {fileUpload?.isUploading && <Spinner />}
        {fileUpload && !fileUpload.isUploading && (
          <button
            type="button"
            aria-label="Remove file"
            className="absolute right-[-16px] top-[-8px] flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
            onClick={() => {
              setFileUpload(null);
            }}
          >
            <svg
              width="12"
              height="20"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="9.35876"
                y="1.58058"
                width="1.5"
                height="11"
                rx="0.75"
                transform="rotate(45 9.35876 1.58058)"
                fill="currentColor"
              />
              <rect
                x="10.4194"
                y="9.35876"
                width="1.5"
                height="11"
                rx="0.75"
                transform="rotate(135 10.4194 9.35876)"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

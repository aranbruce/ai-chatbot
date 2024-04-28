import { useRef, useContext } from "react";
import {
  FileCollectionContext,
  FileCollectionContextProps,
  FileCollectionItem,
  FileInputItem,
} from "../contexts/file-collection-context"; // adjust the path as needed
import { v4 as uuidv4 } from "uuid";
import Spinner from "./spinner";

const UploadButton = () => {
  const { fileCollection, setFileCollection, filesAsInput, setFilesAsInput } =
    useContext<FileCollectionContextProps>(FileCollectionContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = fileInputRef.current as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      // Add file to the filesAsInput array
      const fileId = uuidv4();
      const newFileAsInput: FileInputItem = {
        fileId,
        isUploading: true,
        fileName: file.name,
      };
      setFilesAsInput([...filesAsInput, newFileAsInput]);
      const formData = new FormData();
      formData.append("file", file);
      fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const fileObject: FileCollectionItem[] = [
            { fileId, fileName: file.name, fileContent: data },
          ];
          setTimeout(() => {
            setFileCollection([...fileCollection, ...fileObject]);
            setFilesAsInput((prevFilesAsInput) => {
              return prevFilesAsInput.map((fileAsInput) => {
                if (fileAsInput.fileId === fileId) {
                  return {
                    ...fileAsInput,
                    isUploading: false,
                  };
                }
                return fileAsInput;
              });
            });
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleAddFileButtonClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRemoveFileButtonClick = (fileId: string) => {
    // remove the file from the filesAsInput array with the matching id
    setFilesAsInput(filesAsInput.filter((file) => file.fileId !== fileId));
    // remove the file from the fileCollection array with the matching id
    setFileCollection(fileCollection.filter((file) => file.fileId !== fileId));
    const fileInput = fileInputRef.current as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div
      className={`display flex flex-wrap gap-1 items-start ${
        filesAsInput.length > 0 ? "p-2" : ""
      }`}
    >
      {filesAsInput &&
        filesAsInput.map((file) => (
          <div
            key={file.fileId}
            className={"display flex flex-col gap-2 items-start transition"}
          >
            <div className="flex flex-row relative  bg-white dark:bg-zinc-900 left-0 border border-zinc-200 dark:border-zinc-700 p-3 rounded-2xl text-sm  text-zinc-500 dark:text-zinc-400 text gap-2">
              {file.isUploading && <Spinner />}
              {file.fileName.length > 30
                ? `${file.fileName.substring(0, 30)}...`
                : file.fileName}
              <button
                className="absolute top-[-8px] right-[-8px] rounded-full bg-zinc-100 dark:bg-zinc-700 p-[3px] border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50"
                onClick={() => handleRemoveFileButtonClick(file.fileId)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-sm"
                >
                  <path
                    d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        accept=".pdf"
        className="hidden"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange(event)
        }
      />
      <button
        type="button"
        aria-label="attach file"
        className="flex bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-800 p-[0.375rem] items-center h-fit bottom-[0.75rem] left-[0.75rem] absolute text-zinc-900 dark:text-zinc-50 focus:outline-none focus-visible:ring-[2px] ring-zinc-400 dark:ring-zinc-400"
        onClick={() => handleAddFileButtonClick()}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default UploadButton;

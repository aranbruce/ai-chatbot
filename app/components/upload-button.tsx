import {useEffect, useState} from "react";

const UploadButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    console.log("isLoading: ", isLoading);
  }, [isLoading]);

  const handleButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    console.log("file: ", file?.name);
    setFile(file);
    setIsLoading(true);
    // wait 3 seconds to simulate file upload
    setTimeout(() => {
      setIsLoading(false);
      alert("File uploaded functionality coming soon!");
    }, 3000);


    // send file to /api/file-upload
    // if (file) {
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   setIsLoading(true);
    //   fetch('/api/file-upload', {
    //     method: 'POST',
    //     body: formData
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    // }
  }

  return (
    <div className={"display flex flex-col gap-2 items-start"}>
      {file && (
        <div className={`display flex flex-col gap-2 items-start transition  ${file ? "p-2" : ""}`}>
          <div className="flex flex-row relative  bg-white dark:bg-zinc-900 shadow-sm left-0 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm  text-zinc-500 dark:text-zinc-400 text gap-2">
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-zinc-950 dark:border-zinc-100"></div>}
            {file?.name}
          </div>
        </div>
      )}
      <input type="file" id="fileInput" className="hidden" onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event)} />
      <button type="button" aria-label="attach file" className="flex p-2 items-center h-fit bottom-[6px] absolute text-zinc-900 dark:text-zinc-50" onClick={() => handleButtonClick()} disabled={isLoading}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="currentColor"></path>
          </svg>
      </button>
    </div>
  );
}

export default UploadButton;

import { useRef, useContext} from "react";
import { FileCollectionContext, FileCollectionContextProps } from '../contexts/file-collection-context'; // adjust the path as needed


const UploadButton = () => {
  const { fileCollection, setFileCollection, fileAsInput, setFileAsInput } = useContext<FileCollectionContextProps>(FileCollectionContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = fileInputRef.current as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      setFileAsInput({
        isUploading: true,
        fileName: file.name
      });
      const formData = new FormData();
      formData.append('file', file);
      // setFileIsLoading(true);
      fetch('/api/file-upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        const fileObject: object[] = [{ fileName: file.name, fileContent: data }];
        setTimeout(() => {
          setFileCollection([...fileCollection, ...fileObject]);
          setFileAsInput({
            isUploading: false,
            fileName: file.name
          });
        }, 1000)        
      })
      .catch(error => {
        console.error(error);
      });
    }
  }

  const handleAddFileButtonClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  const handleRemoveFileButtonClick = () => {
    setFileAsInput(null);
    setFileCollection(fileCollection.slice(0, -1));
    const fileInput = fileInputRef.current as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <div className={"display flex flex-col gap-2 items-start"}>
      {fileAsInput && (
        <div className={`display flex flex-col gap-2 items-start transition  ${fileAsInput ? "p-2" : ""}`}>
          <div className="flex flex-row relative  bg-white dark:bg-zinc-900 shadow-sm left-0 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm  text-zinc-500 dark:text-zinc-400 text gap-2">
            {fileAsInput.isUploading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-zinc-950 dark:border-zinc-100"></div>}
            {fileAsInput.fileName}
            <button className="absolute top-[-12px] right-[-12px] rounded-full bg-zinc-100 dark:bg-zinc-700 p-[3px] border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50" onClick={() => handleRemoveFileButtonClick()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-sm">
                <path d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      <input type="file" id="fileInput" ref={fileInputRef} accept=".pdf" className="hidden" onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event)} />
      <button type="button" aria-label="attach file" className="flex p-2 items-center h-fit bottom-[0.4rem] left-[0.2rem] absolute text-zinc-900 dark:text-zinc-50" onClick={() => handleAddFileButtonClick()} disabled={fileAsInput?.isUploading}>
        <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
}

export default UploadButton;

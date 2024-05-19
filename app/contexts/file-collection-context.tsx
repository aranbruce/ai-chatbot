import { createContext, useState } from "react";

export interface FileInputItem {
  fileId: string;
  isUploading: boolean;
  fileName: string;
}

export interface FileCollectionItem {
  fileId: string;
  fileName: string;
  fileContent: string;
}

type FileCollectionArray = Array<FileCollectionItem>;
type FileInputArray = Array<FileInputItem>;

export interface FileCollectionContextProps {
  fileCollection: FileCollectionArray;
  setFileCollection: React.Dispatch<React.SetStateAction<FileCollectionArray>>;
  filesAsInput: FileInputArray;
  setFilesAsInput: React.Dispatch<React.SetStateAction<FileInputArray>>;
}

export const FileCollectionContext = createContext<FileCollectionContextProps>({
  fileCollection: [],
  setFileCollection: () => {},
  filesAsInput: [],
  setFilesAsInput: () => {},
});

export const FileCollectionContextProvider = (props: any) => {
  const [fileCollection, setFileCollection] = useState<FileCollectionArray>([]);
  const [filesAsInput, setFilesAsInput] = useState<FileInputArray>([]);

  return (
    <FileCollectionContext.Provider
      value={{
        fileCollection,
        setFileCollection,
        filesAsInput,
        setFilesAsInput,
      }}
    >
      {props.children}
    </FileCollectionContext.Provider>
  );
};

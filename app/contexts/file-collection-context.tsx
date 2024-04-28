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

export interface FileCollectionContextProps {
  fileCollection: Array<FileCollectionItem>; // Specify the type argument for the Array type
  setFileCollection: React.Dispatch<
    React.SetStateAction<Array<FileCollectionItem>>
  >;
  filesAsInput: Array<FileInputItem>;
  setFilesAsInput: React.Dispatch<React.SetStateAction<Array<FileInputItem>>>;
}

export const FileCollectionContext = createContext<FileCollectionContextProps>({
  fileCollection: [],
  setFileCollection: () => {}, // initial value
  filesAsInput: [],
  setFilesAsInput: () => {}, // initial value
});

export const FileCollectionContextProvider = (props: any) => {
  const [fileCollection, setFileCollection] = useState(
    [] as Array<FileCollectionItem>
  );
  const [filesAsInput, setFilesAsInput] = useState([] as Array<FileInputItem>);

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

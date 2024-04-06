import { createContext, useState } from 'react';

interface FileInput {
  isUploading: boolean;
  fileName: string;
}

export interface FileCollectionContextProps {
  fileCollection: Array<object>; // Specify the type argument for the Array type
  setFileCollection: React.Dispatch<React.SetStateAction<Array<object>>>;
  fileAsInput: FileInput | null
  setFileAsInput: React.Dispatch<React.SetStateAction<FileInput | null>>;
}

export const FileCollectionContext = createContext<FileCollectionContextProps>({
    fileCollection: [],
    setFileCollection: () => {}, // initial value
    fileAsInput: null,
    setFileAsInput: () => {}, // initial value
});

export const FileCollectionContextProvider = (props: any) => {
  const [fileCollection, setFileCollection] = useState([] as Array<object>);
  const [fileAsInput, setFileAsInput] = useState<FileInput | null>(null);

  return (
    <FileCollectionContext.Provider
      value={{
        fileCollection,
        setFileCollection,
        fileAsInput,
        setFileAsInput,
      }}
    >
      {props.children}
    </FileCollectionContext.Provider>
  );
};
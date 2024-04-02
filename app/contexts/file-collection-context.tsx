import { createContext, useEffect, useState } from 'react';

export interface FileCollectionContextProps {
    fileCollectionData: string;
    setFileCollectionData: React.Dispatch<React.SetStateAction<string>>;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    fileIsLoading: boolean;
    setFileIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileCollectionContext = createContext<FileCollectionContextProps>({
    fileCollectionData: "",
    setFileCollectionData: () => {}, // initial value
    file: null,
    setFile: () => {}, // initial value
    fileIsLoading: false,
    setFileIsLoading: () => {}, // initial value
});


export const FileCollectionContextProvider = (props: any) => {
  const [fileCollectionData, setFileCollectionData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileIsLoading, setFileIsLoading] = useState(false);

  return (
    <FileCollectionContext.Provider
      value={{
        fileCollectionData,
        setFileCollectionData,
        file,
        setFile,
        fileIsLoading,
        setFileIsLoading,
      }}
    >
      {props.children}
    </FileCollectionContext.Provider>
  );
};
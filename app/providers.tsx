
'use client';

import { FileCollectionContextProvider } from "./contexts/file-collection-context";  
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <FileCollectionContextProvider>
            {children}
        </FileCollectionContextProvider>
    );
}
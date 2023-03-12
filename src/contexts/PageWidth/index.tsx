import { createContext } from "react";

interface ProviderPageSize {
  pageWidth: string;
  setPageWidth?: React.Dispatch<React.SetStateAction<string>>;
}

export const PageWidthContext = createContext<ProviderPageSize>({ pageWidth: "85%" });

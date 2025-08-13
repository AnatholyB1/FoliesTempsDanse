"use client";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type SearchContextType<T extends object> = {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
  setData: (data: T[]) => void;
};

const SearchContext = createContext<unknown>(undefined);

export function SearchProvider<T extends object>({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    if (!data) return;
    if (query === "") {
      setResults(data);
      return;
    }
    const lower = query.toLowerCase();
    const keys =
      data.length > 0
        ? Object.keys(data[0]).filter(
          k => typeof data[0][k as keyof typeof data[0]] === "string"
        )
        : [];
    setResults(
      data.filter(item =>
        keys.some(
          key =>
            typeof item[key as keyof typeof item] === "string" &&
            (item[key as keyof typeof item] as string).toLowerCase().includes(lower)
        )
      )
    );
  }, [query, data]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, setData }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch<T extends object>() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx as SearchContextType<T>;
}
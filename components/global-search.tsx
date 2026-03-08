"use client";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type SearchContextType<T extends object> = {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
  setData: (data: T[]) => void;
};

const SearchContext = createContext<unknown>(undefined);

/** Fields that are internal/technical and should be excluded from search. */
const IGNORED_FIELDS = new Set(["_id", "_creationTime", "photo", "photo_prise_par"]);

/** Extracts all searchable field values from an item as trimmed lowercase strings. */
function getFieldValues(item: object): string[] {
  return Object.entries(item)
    .filter(([k, v]) =>
      !IGNORED_FIELDS.has(k) &&
      v !== null && v !== undefined &&
      (typeof v === "string" || typeof v === "number")
    )
    .map(([, v]) => String(v).toLowerCase().trim())
    .filter(Boolean);
}

/**
 * Scores an item against a search query.
 *
 * Score = phraseBonus + matchedCount * 100 + positionBonus
 *
 * phraseBonus   : +1000 if the full phrase appears verbatim in a single field
 * matchedCount  : number of individual words found anywhere in the item
 * positionBonus : for each matched word at query-index i, adds (words.length - i)
 *                 so earlier words in the query rank higher on ties
 *
 * Example for query "body noir" (2 words):
 *   "body noir" exact in one field → 1203
 *   both "body" + "noir" found    →  203
 *   only "body" (index 0)         →  102
 *   only "noir" (index 1)         →  101
 *   no match                      →    0
 */
function scoreItem(item: object, words: string[], fullPhrase: string): number {
  const fieldValues = getFieldValues(item);

  const phraseBonus = fieldValues.some(val => val.includes(fullPhrase)) ? 1000 : 0;

  const matchedIndices = words
    .map((word, i) => (fieldValues.some(val => val.includes(word)) ? i : -1))
    .filter(i => i >= 0);

  if (matchedIndices.length === 0) return 0;

  const matchedCount = matchedIndices.length;
  const positionBonus = matchedIndices.reduce(
    (sum, i) => sum + (words.length - i),
    0
  );

  return phraseBonus + matchedCount * 100 + positionBonus;
}

export function SearchProvider<T extends object>({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    if (!data) return;
    if (query.trim() === "") {
      setResults(data);
      return;
    }
    const lower = query.toLowerCase().trim();
    const words = lower.split(/\s+/).filter(Boolean);

    const scored = data
      .map(item => ({ item, score: scoreItem(item, words, lower) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    setResults(scored.map(({ item }) => item));
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
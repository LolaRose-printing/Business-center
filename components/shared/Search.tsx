"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize query state from URL param "query"
  const initialQuery = searchParams.get("query") ?? "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    // Avoid pushing route on initial render when query is same as URL param
    if (query === initialQuery) return;

    const delayDebounceFn = setTimeout(() => {
      if (query) {
        const newUrl = formUrlQuery({
          searchParams: searchParams.toString(),
          key: "query",
          value: query,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          searchParams: searchParams.toString(),
          keysToRemove: ["query"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [router, searchParams, query, initialQuery]);

  return (
    <div className="search">
      <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />

      <Input
        className="search-field"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

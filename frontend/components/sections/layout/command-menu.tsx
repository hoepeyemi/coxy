"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEnvironmentStore } from "@/components/context";
import UnlockNow from "@/components/unlock-now";

export default function CommandMenu({ ...props }: ButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { paid } = useEnvironmentStore((store) => store);
  const [searchResults, setSearchResults] = useState<{ name?: string; domain_name?: string; symbol?: string }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { searchBarValue, setSearchBarValue, leaderboard } =
    useEnvironmentStore((store) => store);
  const [searchState, setSearchState] = useState(0);

  React.useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    // Only add event listeners after we're on the client side
    if (!isClient) return;

    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isClient]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      console.log("SEARCH TERM", searchTerm);
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setSearchState(1);
        return;
      }

      try {
        setSearchState(2);
        fetch(`/api/domain-monitor?action=search&query=${searchTerm}`)
          .then((res) => res.json())
          .then((data) => {
            setSearchState(data.domains?.length > 0 ? 0 : 1);
            setSearchResults(data.domains || []);
          });
      } catch (error) {
        console.error("Search failed", error);
        setSearchState(1);
      }
    }, 300),
    [setSearchResults, setSearchState]
  );

  // Removed IPFS image fetching as it's not needed for domain search
  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "sen relative h-10 flex w-full sm:w-80 bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-80"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex sm:hidden md:hidden lg:inline-flex w-full text-start ">
          Search domains...
        </span>
        <span className="hidden sm:inline-flex md:inline-flex lg:hidden w-full text-start">
          Search...
        </span>
        <kbd className="pointer-events-none absolute right-[0.4rem] top-[0.4rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-md font-medium opacity-100 sm:flex">
          <span className="text-sm">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {paid ? (
          <>
            <CommandInput
              value={searchBarValue}
              onValueChange={(search) => {
                setSearchBarValue(search);
                debouncedSearch(search);
              }}
              placeholder="Type a domain name or search..."
            />
            <CommandList>
              <CommandEmpty>
                {searchState == 0
                  ? "No results found"
                  : searchState == 1
                  ? "Type a longer search term"
                  : "Loading..."}
              </CommandEmpty>
              <CommandGroup heading="Domains">
                {Array.isArray(
                  searchBarValue == "" ? leaderboard : searchResults
                ) &&
                  (searchBarValue == "" ? leaderboard : searchResults).map(
                    (navItem, id) => {
                      // Type guard to ensure navItem has the expected properties
                      const item = navItem as { name?: string; domain_name?: string; symbol?: string; type?: string };
                      return (
                        <CommandItem
                          key={id}
                          value={(item.symbol || 'domain') + id}
                          onSelect={() => {
                            runCommand(() => router.push("/domain-monitor"));
                          }}
                          className="data-[selected='true']:bg-secondary cursor-pointer"
                        >
                          <div className="h-4 w-4 mr-1 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs">🌐</span>
                          </div>
                          <span>{item.name || item.domain_name || 'Domain'}</span>
                          <span className="text-accent">/ Domain</span>
                          <span className="ml-auto text-muted-foreground">
                            {item.type || 'Web3 Domain'}
                          </span>
                        </CommandItem>
                      );
                    }
                  )}
              </CommandGroup>

              <CommandSeparator />
            </CommandList>
          </>
        ) : (
          <div className="h-[300px] flex flex-col justify-center">
            <UnlockNow text="Search and analyze all memecoins" />
          </div>
        )}
      </CommandDialog>
    </>
  );
}

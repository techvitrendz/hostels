import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export type FilterState = {
  ac: boolean | null;
  sharing: number[];
  bedType: string[];
  blockType: string[];
  search: string;
};

type FilterProps = {
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
};

const sharingOptions = [1, 2, 3, 4, 6];
const bedTypes = ["bunker", "normal"];
const blockTypes = ["deluxe", "apartment", "normal"];

export default function Filter({ filter, setFilter }: FilterProps) {
  return (
    <div className="flex w-full items-center justify-end gap-2">
      {/* Ratings */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-sm text-white hover:bg-neutral-800/50 transition">
            <span>Ratings</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[160px]">
          <DropdownMenuRadioGroup value="all">
            <DropdownMenuRadioItem value="all">All Ratings</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="4+">4+ Stars</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="3+">3+ Stars</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu> */}

      {/* AC Type */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-sm text-white hover:bg-neutral-800/50 transition">
            <span>AC Type</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[160px]">
          <DropdownMenuRadioGroup
            value={filter.ac === null ? "any" : filter.ac ? "ac" : "non-ac"}
            onValueChange={(value) => {
              setFilter({
                ...filter,
                ac: value === "any" ? null : value === "ac" ? true : false,
              });
            }}
          >
            <DropdownMenuRadioItem value="any">Any</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ac">AC</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="non-ac">Non-AC</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Block Type */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-sm text-white hover:bg-neutral-800/50 transition">
            <span>Block Type</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[160px]">
          {blockTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={filter.blockType.includes(type)}
              onCheckedChange={(checked) => {
                setFilter({
                  ...filter,
                  blockType: checked
                    ? [...filter.blockType, type]
                    : filter.blockType.filter((t) => t !== type),
                });
              }}
            >
              {type[0].toUpperCase() + type.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Advanced Filters Icon */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800/60 hover:bg-neutral-700/60 transition">
            <SlidersHorizontal className="h-4 w-4 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px]" align="end">
          <div className="p-2">
            <p className="text-sm font-medium mb-2 text-white">More Filters</p>
            
            {/* Sharing */}
            <div className="mb-3">
              <p className="text-xs text-neutral-400 mb-1">Sharing</p>
              {sharingOptions.map((num) => (
                <DropdownMenuCheckboxItem
                  key={num}
                  checked={filter.sharing.includes(num)}
                  onCheckedChange={(checked) => {
                    setFilter({
                      ...filter,
                      sharing: checked
                        ? [...filter.sharing, num]
                        : filter.sharing.filter((n) => n !== num),
                    });
                  }}
                >
                  {num}-Sharing
                </DropdownMenuCheckboxItem>
              ))}
            </div>

            {/* Bed Type */}
            <div>
              <p className="text-xs text-neutral-400 mb-1">Bed Type</p>
              {bedTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filter.bedType.includes(type)}
                  onCheckedChange={(checked) => {
                    setFilter({
                      ...filter,
                      bedType: checked
                        ? [...filter.bedType, type]
                        : filter.bedType.filter((t) => t !== type),
                    });
                  }}
                >
                  {type[0].toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

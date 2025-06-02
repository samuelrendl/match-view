import { ItemEntity } from "@/types/gameEntity";
import React from "react";
import GameEntity from "../GameEntity";

const Items = ({
  shorterGameVersion,
  items,
  fetchedItems,
  size = "lg",
}: {
  shorterGameVersion: string;
  items: number[];
  fetchedItems: Record<number, ItemEntity>;
  size?: "sm" | "lg";
}) => {
  return (
    <>
      {/* Items */}
      {/* Mobile */}
      <div className="grid grid-flow-col gap-0.5 sm:hidden">
        {items.map((item, index) => (
          <div
            key={`item-${index}`}
            className={`relative rounded-sm bg-black/50 ${size === "lg" ? "size-5" : "size-4"}`}
          >
            <GameEntity
              entity={fetchedItems[item!]}
              gameVersion={shorterGameVersion}
              type="item"
            />
          </div>
        ))}
      </div>

      {/* Tablet and bigger */}
      <div className="hidden sm:flex sm:flex-col sm:justify-center sm:gap-0.5 sm:w-fit">
        {/* top row: items 1,2,3 and then 7 */}
        <div className="flex gap-0.5">
          {[0, 1, 2, 6].map((i) => (
            <div
              key={`item-${i}`}
              className={`relative rounded-sm bg-black/50 ${size === "lg" ? "size-5 sm:size-6" : "size-5 sm:size-4"}`}
            >
              <GameEntity
                entity={fetchedItems[items[i]!]}
                gameVersion={shorterGameVersion}
                type="item"
              />
            </div>
          ))}
        </div>

        {/* bottom row: items 4,5,6 */}
        <div className="flex gap-0.5">
          {[3, 4, 5].map((i) => (
            <div
              key={`item-${i}`}
              className={`relative rounded-sm bg-black/50 ${size === "lg" ? "size-5 sm:size-6" : "size-5 sm:size-4"}`}
            >
              <GameEntity
                entity={fetchedItems[items[i]!]}
                gameVersion={shorterGameVersion}
                type="item"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Items;

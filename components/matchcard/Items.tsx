import { ItemEntity } from "@/types/gameEntity";
import React from "react";
import GameEntity from "../GameEntity";

const Items = ({
  shorterGameVersion,
  gameType,
  items,
  fetchedItems,
}: {
  shorterGameVersion: string;
  gameType: string;
  items: number[];
  fetchedItems: Record<number, ItemEntity>;
}) => {
  return (
    <div
      className={`flex flex-col gap-2 ${gameType === "Arena" ? "sm:flex-col-reverse sm:gap-2 sm:justify-center sm:items-center" : "sm:flex-row sm:gap-6"}`}
    >
      {/* Items */}
      {/* Mobile */}
      <div className="grid grid-flow-col gap-0.5 sm:hidden">
        {items.map((item, index) => (
          <div
            key={`item-${index}`}
            className="relative size-5 rounded-sm bg-black/50"
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
              className="relative rounded-sm bg-black/50 size-5 sm:size-6"
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
              className="relative rounded-sm bg-black/50 size-5 sm:size-6"
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
    </div>
  );
};

export default Items;

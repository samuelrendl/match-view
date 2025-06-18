import { useEffect, useState } from "react";
import { StaticData } from "@/types/matchList";
import {
  fetchAugments,
  fetchItems,
  fetchQueueAndGamemodes,
  fetchRunes,
  fetchSummonerSpells,
} from "@/utils/api";

const LOCAL_STORAGE_KEY = (version: string) => `static_data_${version}`;

export const useStaticData = (version: string) => {
  const [data, setData] = useState<StaticData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem(LOCAL_STORAGE_KEY(version));
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const [items, summoners, runes, augments, queueGameModes] =
          await Promise.all([
            fetchItems(version),
            fetchSummonerSpells(version),
            fetchRunes(version),
            fetchAugments(),
            fetchQueueAndGamemodes(),
          ]);

        const staticData: StaticData = {
          items,
          summoners,
          runes,
          augments,
          queues: queueGameModes.queues,
          gamemodes: queueGameModes.gamemodes,
        };

        localStorage.setItem(
          LOCAL_STORAGE_KEY(version),
          JSON.stringify(staticData)
        );
        setData(staticData);
      } catch (err) {
        console.error("Error fetching static data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [version]);

  return { data, loading };
};

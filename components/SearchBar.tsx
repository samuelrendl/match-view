"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

const regions = [
  { label: "EUNE", value: "EUN1" },
  { label: "EUW", value: "EUW1" },
  { label: "NA", value: "NA1" },
];

const SearchBar = () => {
  const [error, setError] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("EUNE");
  const router = useRouter();

  const validateUsername = (input: string) => {
    const regex = /^[a-zA-Z0-9 ]{3,16}#[a-zA-Z0-9]{2,5}$/;
    return regex.test(input);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const region = formData.get("region") as string;

    if (!validateUsername(username)) {
      setError("Wrong input format. Use gamename#tag");
      return;
    }

    setError("");
    if (username.trim()) {
      router.push(
        `/search?username=${encodeURIComponent(username)}&region=${region}`
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-96 items-center justify-center gap-1 rounded-3xl bg-slate-100 p-2"
      >
        <Input
          name="username"
          type="text"
          className="border-none text-sm text-black shadow-none outline-none focus-visible:ring-transparent"
          placeholder="Search your RiotID..."
        />

        <select
          name="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="rounded-full bg-white p-2 text-sm text-black shadow-md"
        >
          {regions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <Button
          type="submit"
          variant="default"
          className=" mt-0 hidden rounded-full bg-white text-black shadow-md sm:block"
        >
          <MagnifyingGlassIcon className="size-4" />
        </Button>
      </form>

      {error && (
        <p className="mt-1 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchBar;

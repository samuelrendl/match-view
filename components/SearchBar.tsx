"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/search?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex rounded-sm bg-white">
        <Input
          type="text"
          className="border-none text-sm text-black shadow-none outline-none focus-visible:ring-transparent"
          placeholder="Search your RiotID..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" variant="ghost" className="hidden">
          <MagnifyingGlassIcon />
        </Button>
      </form>
    </>
  );
};

export default SearchBar;

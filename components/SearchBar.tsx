"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    if (username.trim()) {
      router.push(`/search?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex rounded-sm bg-white">
        <Input
          name="username"
          type="text"
          className="border-none text-sm text-black shadow-none outline-none focus-visible:ring-transparent"
          placeholder="Search your RiotID..."
        />
        <Button type="submit" variant="ghost" className="hidden">
          <MagnifyingGlassIcon />
        </Button>
      </form>
    </>
  );
};

export default SearchBar;

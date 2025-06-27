"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const validateUsername = (input: string) => {
    const regex = /^[a-zA-Z0-9 ]{3,16}#[a-zA-Z0-9]{2,5}$/;
    return regex.test(input);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    if (!validateUsername(username)) {
      setError("Wrong input format. Use gamename#tag");
      return;
    }
    setError("");
    if (username.trim()) {
      router.push(`/search?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-96 rounded-3xl bg-slate-100"
      >
        <Input
          name="username"
          type="text"
          className="border-none text-sm text-black shadow-none outline-none focus-visible:ring-transparent"
          placeholder="Search your RiotID..."
        />

        <Button
          type="submit"
          variant="default"
          className="m-0.5 hidden border bg-white p-3"
        >
          <MagnifyingGlassIcon className="text-black" />
        </Button>
      </form>
      {error && (
        <p className="mt-1 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchBar;

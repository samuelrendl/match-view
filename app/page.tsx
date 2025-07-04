import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bai-jamjuree text-4xl font-semibold italic text-white">
        Match<span className="text-primary">View</span>
      </h1>
      <div className="w-full px-2">
        <SearchBar />
      </div>
    </main>
  );
}

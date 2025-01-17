import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bai-jamjuree text-5xl font-semibold italic text-white">
        Match<span className="text-primary">View</span>
      </h1>
      <SearchBar />
    </main>
  );
}

import Navbar from "@/components/Navbar";
import MatchList from "@/components/MatchList";
import { Suspense } from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) => {
  const { username } = await searchParams;
  if (!username) return <div>No username provided.</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <MatchList username={username} />
    </Suspense>
  );
};

export default Page;

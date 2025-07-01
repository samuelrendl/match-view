import Navbar from "@/components/Navbar";
import MatchList from "@/components/MatchList";
import { Suspense } from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ username: string, region: string }>;
}) => {
  const { username, region } = await searchParams;
  if (!username) return <div>No username provided.</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <MatchList username={username} region={region} />
    </Suspense>
  );
};

export default Page;

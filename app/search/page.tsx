import Navbar from "@/components/Navbar";
import MatchList from "@/components/MatchList";

const Page = async ({ searchParams }: { searchParams: Promise<{ username?: string }> }) => {
  const { username } = await searchParams;
  if (!username) return <div>No username provided.</div>;

  return (
    <>
      <Navbar />
      <MatchList username={username} />
    </>
  );
};

export default Page;

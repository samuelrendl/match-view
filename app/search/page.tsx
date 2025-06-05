import Navbar from "@/components/Navbar";
import MatchList from "@/components/MatchList";

interface PageProps {
  searchParams: { username?: string };
}

const Page = ({ searchParams }: PageProps) => {
  const { username } = searchParams;
  if (!username) return <div>No username provided.</div>;

  return (
    <>
      <Navbar />
      <MatchList username={username} />
    </>
  );
};

export default Page;

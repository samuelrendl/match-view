import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <nav className="m-4 flex justify-between gap-5">
      <Link
        href="/"
        className=" font-bai-jamjuree text-2xl font-semibold italic text-white"
      >
        Match<span className="text-primary">View</span>
      </Link>
      <SearchBar />
    </nav>
  );
};

export default Navbar;

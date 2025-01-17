import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <nav>
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

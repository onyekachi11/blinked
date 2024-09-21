"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";

const Navbar = () => {
  // const handle
  return (
    <div className="flex justify-between  items-center p-5 px-10 bg-white shadow-xl border border-gray-300 sticky">
      <p className="font-semibold text-2xl">Blinked</p>
      <WalletMultiButton />
    </div>
  );
};

export default Navbar;

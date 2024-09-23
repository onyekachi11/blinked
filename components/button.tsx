"use client";
import React from "react";

interface Button {
  onClick?: (value?: unknown) => void;
  value: string;
  type?: "submit" | "reset" | "button" | undefined;
}
const Button = ({ onClick, value, type }: Button) => {
  return (
    <button
      className="border px-5 py-2 rounded-md text-white bg-[#2a2a2b]"
      onClick={() => onClick?.()}
      type={type}
    >
      {value}
    </button>
  );
};

export default Button;

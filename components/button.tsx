"use client";
import React from "react";

interface Button {
  onClick?: (value?: unknown) => void;
  value: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
}
const Button = ({ onClick, value, type, disabled }: Button) => {
  return (
    <button
      disabled={disabled}
      className={` ${
        disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#2a2a2b]"
      } "border px-5 py-2 rounded-md text-white  "`}
      onClick={() => onClick?.()}
      type={type}
    >
      {value}
    </button>
  );
};

export default Button;

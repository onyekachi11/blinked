import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConnectWallet from "@/provider/ConnectWallet";
import { Toaster } from "react-hot-toast";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
import Dnd from "@/provider/Dnd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blinked | Home",
  description: "No code platform to generate your own blinks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Dnd>
          <ConnectWallet>
            {children}
            <Toaster position="bottom-right" />
          </ConnectWallet>
        </Dnd>
      </body>
    </html>
  );
}

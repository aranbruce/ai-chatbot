import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Header from "./components/header";
import { Providers } from "./providers";
import { AI } from "./action";



const dmSans = DM_Sans({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Pal | AI Chatbot",
  description: "An AI chatbot that can perform functions like searching the web, getting the weather, and finding the latest news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;

}) {
  return (
    <html lang="en">
      <body className={dmSans.className + "bg-white dark:bg-zinc-950 flex h-svh"}>
        <Providers>
          <AI>
            <Header />
            {children}
          </AI>
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import { DM_Sans } from "next/font/google";
import Header from "./components/header";
import { Providers } from "./providers";


const dmSans = DM_Sans({subsets: ["latin"]});

export const metadata = {
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
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import Header from "./components/header";
import { Providers } from "./providers";
import { AI } from "./libs/server-actions/actions";

export const metadata: Metadata = {
  title: "Pal | AI Chatbot",
  description:
    "An AI chatbot that can perform functions like searching the web, getting the weather, and finding the latest news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <AI>
          <Header />
          <Providers>{children}</Providers>
        </AI>
      </body>
    </html>
  );
}

import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Powered Chatbot Demo',
  description: 'A demo chatbot app template that helps answer your chatbot perform functions like searching the web.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}

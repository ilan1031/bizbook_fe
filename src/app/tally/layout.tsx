import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import KeyboardShortcutsFooter from "../../compo/footer";
import Navbar from "../../compo/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Tally",
};
// A nested layout: the app's root layout already renders <html> and <body>.
export default function TallyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <KeyboardShortcutsFooter/>
      <Navbar onMenuItemClick={undefined} />

      {children}
    </div>
  );
}
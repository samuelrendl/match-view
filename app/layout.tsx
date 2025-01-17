import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Poppins, Bai_Jamjuree } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MatchView",
  description:
    "Explore your League of Legends journey with MatchView, the ultimate platform for viewing your match history. Dive into detailed insights about your recent games, including teammates, scores, kills, and more. Track your performance and relive your victories!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${baiJamjuree.variable} bg-background px-3 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

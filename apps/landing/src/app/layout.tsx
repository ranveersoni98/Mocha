import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Fathom from "@/component/Fathom";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Mocha — Open Source Issue Management",
  description:
    "Mocha is a modern, self-hosted issue tracker and helpdesk. An open-source alternative to Jira and Zendesk.",
  metadataBase: new URL("https://mocha.embrly.ca"),
  openGraph: {
    title: "Mocha — Open Source Issue Management",
    description:
      "A modern, self-hosted issue tracker and helpdesk. Deploy in minutes, own your data forever.",
    url: "https://mocha.embrly.ca",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <Fathom />
        {children}
      </body>
    </html>
  );
}

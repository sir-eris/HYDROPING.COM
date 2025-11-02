import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'HydroPing - Smart Soil Moisture Stick',
  description: 'HydroPing is a Smart Reliable Affordable soil moisture stick that tells exactly when a plant needs water with integrated Wi-Fi and free App.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favico.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
}

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
        {/* logo */}
      <header className="fixed z-50 top-0 w-full">
        <div className="w-fit mx-auto mt-6 px-4 text-center flex justify-center items-center bg-white/15 backdrop-blur-xs rounded-4xl border border-white/5">
          <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="HydroPing Logo"
            width={50}
            height={50}
          />
          <p className="font-black text-lg -ml-8">HydroPing</p>
          </Link>
        </div>
      </header>

        {children}

        <footer className="fixed z-50 bottom-0 left-0 w-full">
          <div className="w-fit mx-auto mb-6 p-4 row-start-3 flex gap-[24px] flex-wrap items-center justify-center bg-white/15 backdrop-blur-xs rounded-4xl border border-white/5">
          <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="HydroPing Logo"
            width={30}
            height={30}
          />
          </Link>
          {/* <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="/setup-guide"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Setup Guide
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="/examples"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a> */}
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://apps.apple.com/us/app/hydro-ping/id6748595859"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Download iOS App
          </a>
          </div>
      </footer>
      </body>
    </html>
  );
}
